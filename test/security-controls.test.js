const assert = require("node:assert/strict");
const test = require("node:test");
const rateLimit = require("../middleware/rateLimit");
const SankalpPhoto = require("../models/SankalpPhoto");
const galleryController = require("../controllers/galleryController");
const { getPagination } = require("../utils/pagination");
const csrfProtection = require("../middleware/csrfProtection");
const adminAuth = require("../middleware/admin/authMiddleware");
const { hasValidMediaSignature } = require("../middleware/validateUpload");

test("rate limiter rejects requests after the configured threshold", () => {
  const middleware = rateLimit({ windowMs: 60_000, max: 2, message: "limited" });
  const key = `security-test-${Math.random()}`;

  function invoke() {
    let nextCalled = false;
    let statusCode = 200;
    let responseBody;
    const response = {
      set() {},
      status(code) {
        statusCode = code;
        return this;
      },
      json(body) {
        responseBody = body;
        return this;
      },
    };

    middleware({ ip: key, socket: {} }, response, () => {
      nextCalled = true;
    });
    return { nextCalled, statusCode, responseBody };
  }

  assert.equal(invoke().nextCalled, true);
  assert.equal(invoke().nextCalled, true);
  const limited = invoke();
  assert.equal(limited.nextCalled, false);
  assert.equal(limited.statusCode, 429);
  assert.equal(limited.responseBody.message, "limited");
});

test("gallery API escapes search, caps its length, and bounds page results", async (t) => {
  const originalFind = SankalpPhoto.find;
  const originalCountDocuments = SankalpPhoto.countDocuments;
  let capturedQuery;
  let capturedSkip;
  let capturedLimit;

  t.after(() => {
    SankalpPhoto.find = originalFind;
    SankalpPhoto.countDocuments = originalCountDocuments;
  });

  SankalpPhoto.find = (query) => {
    capturedQuery = query;
    return {
      sort() {
        return this;
      },
      skip(value) {
        capturedSkip = value;
        return this;
      },
      limit(value) {
        capturedLimit = value;
        return this;
      },
      lean: async () => [],
    };
  };
  SankalpPhoto.countDocuments = async () => 500;

  const response = {
    statusCode: 200,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    },
  };

  await galleryController.getGalleryApi(
    { query: { search: `a.*${"x".repeat(120)}`, page: "3" } },
    response,
  );

  assert.equal(capturedQuery.isPublished, true);
  assert.equal(capturedQuery.$and.length, 1);
  const searchFields = capturedQuery.$and[0].$or;
  assert.deepEqual(
    searchFields.map((field) => Object.keys(field)[0]),
    ["name", "district", "caption", "dateString"],
  );
  const searchRegex = searchFields.find((field) => field.name)?.name;
  assert.ok(searchRegex instanceof RegExp);
  assert.equal(searchRegex.source.length, 102);
  assert.equal(searchRegex.source.includes("a\\.\\*"), true);
  assert.equal(capturedSkip, 100);
  assert.equal(capturedLimit, 50);
  assert.equal(response.body.page, 3);
  assert.equal(response.body.pageSize, 50);
});

test("pagination normalizes hostile page values and caps page sizes", () => {
  assert.deepEqual(getPagination("-9", 1000, 500), {
    page: 1,
    pageSize: 50,
    total: 1000,
    totalPages: 20,
    skip: 0,
  });
  const huge = getPagination("99999999", Number.MAX_SAFE_INTEGER, 50);
  assert.equal(huge.page, 10000);
  assert.equal(Number.isSafeInteger(huge.skip), true);
  assert.equal(getPagination(["4"], 100, 25).page, 1);
});

test("CSRF guard accepts same-host form requests and rejects missing or foreign origins", () => {
  function invoke({ method = "POST", path = "/settings", origin, referer } = {}) {
    let nextCalled = false;
    let statusCode = 200;
    const req = {
      method,
      path,
      get(name) {
        if (name === "host") return "campaign.example";
        if (name === "origin") return origin;
        if (name === "referer") return referer;
        return undefined;
      },
    };
    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      send() {},
    };
    csrfProtection(req, res, () => { nextCalled = true; });
    return { nextCalled, statusCode };
  }

  assert.equal(invoke({ origin: "https://campaign.example" }).nextCalled, true);
  assert.equal(invoke({ referer: "https://campaign.example/admin" }).nextCalled, true);
  assert.equal(invoke({ origin: "https://evil.example" }).statusCode, 403);
  assert.equal(invoke().statusCode, 403);
  assert.equal(invoke({ method: "GET" }).nextCalled, true);
});

test("admin authorization allows both configured roles and rejects anonymous users", () => {
  function invoke(session) {
    let nextCalled = false;
    let redirected = "";
    adminAuth({ session }, { redirect(path) { redirected = path; } }, () => { nextCalled = true; });
    return { nextCalled, redirected };
  }

  assert.equal(invoke(undefined).redirected, "/admin/pallavipal/main/login");
  assert.equal(invoke({}).redirected, "/admin/pallavipal/main/login");
  assert.equal(invoke({ admin: { role: "admin" } }).nextCalled, true);
  assert.equal(invoke({ admin: { role: "superadmin" } }).nextCalled, true);
});

test("upload signature checks reject content that only claims an allowed extension", () => {
  const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0x00]);
  const fakeJpeg = Buffer.from("not really a jpeg");
  const mp4 = Buffer.alloc(16);
  mp4.write("ftyp", 4, "ascii");

  assert.equal(hasValidMediaSignature(jpeg, "photo.jpg"), true);
  assert.equal(hasValidMediaSignature(fakeJpeg, "photo.jpg"), false);
  assert.equal(hasValidMediaSignature(mp4, "clip.mp4"), true);
  assert.equal(hasValidMediaSignature(fakeJpeg, "poster.png", "thumbnailFile"), false);
});
