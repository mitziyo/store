# Development Workflow (extracted from Git history)

This file is a **reusable, sequential development workflow**, reverse-engineered
from the real Git graph of this project (`develop` branch, 77 commits,
2026-05-23 → 2026-08-01, single author `khan`). It is written so that another
coding agent, in **another project**, can reproduce the same build order,
architecture, and logic — adapted to that project's stack — one commit-step
at a time.

This is NOT a description of the current file layout. It is the ORDER OF
DECISIONS that produced it. Filenames/tech may be adapted (see §5), but the
sequence and the reasoning behind each step must be preserved.

---

## §0a. bookStore naming adaptations (standing rule — apply in every step)

Per user instruction: names are adapted to the **bookStore** domain as they
are carried over from the original (food-delivery/"burak") project, not
copied literally. Domain-neutral names are left unchanged; only names tied
to the original's restaurant/food concept are translated. This table is
authoritative for every step from here on — consult it before naming any
new file/class/enum, instead of re-deciding case by case.

| Original (burak) | bookStore | Status | Notes |
|---|---|---|---|
| `Member` (schema/service/controller/types) | `Member` | unchanged | domain-neutral (a user account), applies to any app |
| `MemberType.USER` | `MemberType.USER` | unchanged | domain-neutral |
| `MemberType.RESTAURANT` | `MemberType.STORE` | ✅ revised (2026-08-30) | corrected from an earlier `ADMIN` naming: burak's `RESTAURANT` names the business entity itself (the restaurant's own account), not a generic role — the direct bookStore equivalent is the store's own account, `STORE`, not `ADMIN` |
| `restaurant.controller.ts` / `restaurantController` | `store.controller.ts` / `storeController` | ✅ revised (2026-08-30) | same reasoning — matches the business-entity naming, not a generic "admin" label. Note: the *panel infrastructure* (`router-admin.ts` filename, the `/admin` URL prefix, the `AdminRequest` type) stays "admin" unchanged — that layer was already generically named in burak itself (independent of the RESTAURANT/STORE business-entity naming), so it needed no correction |
| `routerAdmin.ts` → `router-admin.ts` (Step 11 rename) | same | unchanged | already domain-neutral |
| `Product` (schema/service/controller/types/enum, files `Product.*`) | `Book` (`Book.*`) | ⏳ apply starting Step 22/25 | bookStore sells books, not restaurant dishes |
| `ProductCollection` (DISH/SALAD/DESSERT/DRINK/OTHER) | `BookGenre` — exact members TBD at Step 25 (e.g. FICTION/NONFICTION/SCIENCE/CHILDREN/OTHER) | ⏳ decide at Step 25 | needs a real category set for books, not a 1:1 value copy |
| `ProductSize` (SMALL/NORMAL/LARGE/SET) | needs a book-appropriate replacement or removal — decide at Step 25 (candidate: `BookFormat`: PAPERBACK/HARDCOVER/EBOOK/AUDIOBOOK) | ⏳ decide at Step 25 | "size" as food-portion doesn't map to books; don't copy verbatim |
| `ProductVolume` (0.5/1/1.2/1.5/2 — litres) | likely **dropped** (no book equivalent) — decide at Step 25 | ⏳ decide at Step 25 | litre-volume is drink-specific; flag as a case where the original field has no target-domain equivalent (§0.6) rather than forcing a fake mapping |
| `ProductStatus` (PAUSE/PROCESS/DELETE) | `BookStatus` (same PAUSE/PROCESS/DELETE shape) | ⏳ apply at Step 25 | shape/logic identical, only the type name changes |
| `getRestaurant` API | `getAdmin` (or `getStoreInfo`) | ⏳ apply at Step 49 | matches the `MemberType.ADMIN` rename |
| `Order` / `OrderItem` (schema/service/controller/types) | `Order` / `OrderItem` | unchanged | domain-neutral e-commerce terms |
| `View` / `ViewGroup.PRODUCT` | `View` / `ViewGroup.BOOK` | ⏳ apply at Step 52 | matches the Product→Book rename |
| `memberImage` field | `memberImage` | unchanged | domain-neutral |
| `productImages` field | `bookImages` | ⏳ apply at Step 27 | matches Product→Book |
| `uploads/products/` | `uploads/books/` | ⏳ apply at Step 24/27 | matches Product→Book |
| delivery-fee business rule / `orderDelivery` | unchanged (`orderDelivery`, "delivery") | unchanged | generic e-commerce shipping concept, not restaurant-specific enough to need renaming |

**Rule going forward:** when a step's original commit touches a
`Product`/`restaurant`-named file or symbol not yet in this table, extend
this table with the bookStore-adapted name *before* implementing that step
— don't invent an ad-hoc name inline without recording it here, since
later steps will need the same mapping.

---

## §0. STRICT SEQUENTIAL EXECUTION PROTOCOL — read before doing anything

1. **Initial Setup (Step 1) always comes first.** Never jump to a later step.
2. **One step at a time.** Implement ONLY the current step. Never combine
   two steps, never implement a future step early, even if it looks trivial
   or related.
3. **Stop after every step.** After implementing + validating a step, STOP
   and wait for explicit confirmation ("continue", "next step", etc.) before
   starting the next one. Do not auto-advance.
4. **Validate before advancing.** Inspect changed files, run the project's
   build/typecheck/lint, sanity-check the behavior the step claims to add,
   and compare against that step's "Architecture"/"Purpose" intent. Only
   move on if validation passes.
5. **Adapt, don't blindly copy** (see §5 — Adaptation Rules). Preserve the
   *logic*, *layering*, and *order of dependencies*; translate concrete
   syntax/package names to whatever stack the target project uses. If the
   target project already has an equivalent structure, reuse it instead of
   introducing a parallel one.
6. **If a dependency is unclear, say so — don't guess silently.** Several
   ambiguities are already documented in §4; if you find a new one, add it
   there rather than inventing a resolution.
7. **Commit boundaries are real boundaries.** If a capability belongs to a
   later step, do not build it now, even partially "for convenience."

---

## §1. Git Workflow Found (full chronological sequence)

Legend: ✅ = real architectural step (detailed in §3) · ⛔ = excluded (see §2) · 📝 = reference-only, no implementation (see §3)

| # | Commit | Message | Status |
|---|---|---|---|
| 1 | `2d7ff6d` | feat: initial setup | ✅ Step 1 |
| 2 | `29670b0` | feat: learningabout patterns | 📝 Step 1a |
| 3 | `5aa1f46` | feat: completed TASK L | ⛔ |
| 4 | `80e3a7c` | feat: integration of environmental variables | ✅ Step 2 |
| 5 | `25bf7e2` | feat: create train area | ⛔ |
| 6 | `30523c2` | feat: completed TASK M | ⛔ |
| 7 | `273c849` | feat: connect mongodb via mongoose | ✅ Step 3 |
| 8 | `c362fa8` | feat: express integration | ✅ Step 4 |
| 9 | `89f287a` | feat: completed task in Typescript | ⛔ |
| 10 | `aa6989f` | feat: create router and member controller | ✅ Step 5 |
| 11 | `1c30efe` | fix: modify routing system and controllers | ✅ Step 6 |
| 12 | `968d5d8` | feat: Member dervice model integration | ✅ Step 7 |
| 13 | `5ee1ff8` | feat: develop member schema model | ✅ Step 8 |
| 14 | `a6d949d` | feat: develop train.py and train.ts | ⛔ |
| 15 | `803d07e` | feat: create project standarts | ✅ Step 9 |
| 16 | `3b00365` | feat: create restaurant member related router endpoints | ✅ Step 10 |
| 17 | `82903f7` | fix: router-adming according to naming standarts | ✅ Step 11 |
| 18 | `dcb3a37` | feat: develop signup process | ✅ Step 12 |
| 19 | `091cc4d` | feat: completed mittask | ⛔ |
| 20 | `0cdc7b7` | feat: develop restaurant login process | ✅ Step 13 |
| 21 | `01ea3a1` | fix: modify restaurant login and signup process | ✅ Step 14 |
| 22 | `e535978` | feat: completed task P | ⛔ |
| 23 | `ab77ed7` | fix: organize spa & ssr business logic | ✅ Step 15 |
| 24 | `8fab998` | feat: fronted related css, js, and image creation | ✅ Step 16 |
| 25 | `f7ff4d3` | feat: develop admin frontend pages and integrate header/footer | ✅ Step 17 |
| 26 | `7ec029d` | feat: completed mittask Q | ⛔ |
| 27 | `477e431` | feat: integrate middleware sessions | ✅ Step 18 |
| 28 | `89122f5` | fix: create sessions on login and signup process | ✅ Step 19 |
| 29 | `0f99ff5` | feat: create checkAuthSession api | ✅ Step 20 |
| 30 | `1f31319` | feat: develop logout process (admin) | ✅ Step 21 |
| 31 | `751b91b` | feat: completed TASK R | ⛔ |
| 32 | `3333bbf` | feat: create product controller and product routing apis | ✅ Step 22 |
| 33 | `1f8c8fc` | feat: locals variable integration | ✅ Step 23 |
| 34 | `1e98bf0` | feat: upload files into server via multer | ✅ Step 24 |
| 35 | `0423d23` | feat: configuration product Schema model | ✅ Step 25 |
| 36 | `0857b7b` | feat: completed TASK S | ⛔ |
| 37 | `b45072d` | fix: modify restaurant controller processSignup and processLogin | ✅ Step 26 |
| 38 | `469e297` | feat: createNewProduct business logic by restaurant member | ✅ Step 27 |
| 39 | `6185f42` | feat: modify updateChosenProduct business logic | ✅ Step 28 |
| 40 | `6e212b7` | fix: getAllProducts api and passing data into ejs | ✅ Step 29 |
| 41 | `9b888e5` | feat: completed Task T | ⛔ |
| 42 | `27bdc3c` | feat: develop getUsers business logic | ✅ Step 30 |
| 43 | `3772973` | feat: develop updateChosenUser api | ✅ Step 31 |
| 44 | `997f588` | fix: admin frontend publishing | ✅ Step 32 |
| 45 | `a9bdbaf` | feat: signup process frontend valdation | ✅ Step 33 |
| 46 | `bf1cefa` | fix: memberImage file | ✅ Step 34 |
| 47 | `e6d5ed1` | fix: modify productspage based on products data | ✅ Step 35 |
| 48 | `3ea44f6` | feat: create new product frontend logic develop | ✅ Step 36 |
| 49 | `dab6a97` | feat: update chosen product frontend logic | ✅ Step 37 |
| 50 | `ea35d4f` | fix: users page render real data | ✅ Step 38 |
| 51 | `7293f86` | fix: frontend chosen user update logic | ✅ Step 39 |
| 52 | `2948c82` | fix: modify spa login rest api process | ✅ Step 40 |
| 53 | `05bb10d` | fix: admin project refactoring | ✅ Step 41 |
| 54 | `8f6fbe1` | feat: completed TASK W | ⛔ |
| 55 | `b20cbc1` | feat: completed TASK X | ⛔ |
| 56 | `ea6070a` | feat: completed Task Y | ⛔ |
| 57 | `fa75ebb` | feast: complete Task-Z | ⛔ |
| 58 | `4788a9f` | feast: complete Task-Z | ⛔ |
| 59 | `da50f04` | feat: develop token via jwt | ✅ Step 42 |
| 60 | `753c03e` | feat: develop authentication via tokens with cookies | ✅ Step 43 |
| 61 | `c8d5050` | feat: develop verify authenticated user credentials | ✅ Step 44 |
| 62 | `f777770` | feat: create middleware methods and develop logout process | ✅ Step 45 |
| 63 | `13ee1ec` | fix: modify get member detail logic | ✅ Step 46 |
| 64 | `19ae888` | feat: develop updateMember business logic | ✅ Step 47 |
| 65 | `1885530` | feat: develop getTopUsers rest API | ✅ Step 48 |
| 66 | `4dc1f1c` | feat: create getRestaurant rest api | ✅ Step 49 |
| 67 | `53b96fa` | feat: develop getProducts Api | ✅ Step 50 |
| 68 | `7563316` | feat: develop getProduct rest Api | ✅ Step 51 |
| 69 | `afd2cbf` | feat: create view schema and service models | ✅ Step 52 |
| 70 | `7d7df1f` | fix: modiyf get product business logic | ✅ Step 53 |
| 71 | `d19a06a` | feat: create order related schema models | ✅ Step 54 |
| 72 | `8c2da71` | feat: create order rest api | ✅ Step 55 |
| 73 | `2f0fc1b` | feat: develop getMyOrders rest api | ✅ Step 56 |
| 74 | `e89e1da` | feat: develop updateOrder rest Api | ✅ Step 57 |
| 75 | `ffceb09` | feat: CORS integration | ✅ Step 58 |
| 76 | `9f7bbc9` | feat: new folder | ⛔ |
| 77 | `9159a4c` | feat: solve the problem | ✅ Step 59 |

---

## §2. Excluded commits (not part of the reusable workflow)

Two categories were excluded — both verified by inspecting their diffs, not
guessed from the message alone:

**A. Personal learning/practice commits** — touch only `train.py`,
`train.ts`, `comment.ts`, or `src/server.ts`-as-scratchpad. These are the
author's own TypeScript/Python/ML exercises, unrelated to the app's
architecture (`5aa1f46`†, `25bf7e2`‡, `30523c2`, `89f287a`,
`a6d949d`, `091cc4d`, `e535978`, `7ec029d`, `751b91b`, `0857b7b`, `9b888e5`,
`8f6fbe1`, `b20cbc1`†, `ea6070a`†, `fa75ebb`, `4788a9f`).
(`29670b0` is a related but distinct case — see Step 1a in §3: it is also
pure TypeScript-fundamentals practice with zero package/dependency changes,
but since it names the exact architectural vocabulary — MVC, DI, Middleware/
Decorator patterns — used later in the real steps, it's kept as an optional
reference note rather than fully dropped.)
† = these three also carried one tiny incidental change (a `train` npm
script + `tsx` devDependency in `5aa1f46`; a 1-line optional-chaining
null-guard in `signup.js` in `b20cbc1`; a whitespace-only edit in
`ea6070a`). None are architecturally meaningful — skip them; if the
optional-chaining defensiveness (`?.` on `.files[0]`) is wanted, apply it
naturally while implementing Step 33/34 (signup frontend), not as its own step.
‡ `25bf7e2` ("create train area") — full diff verified: appends one line
to `comment.ts` (`// CLUSTER => DATABASE => COLLECTION => DOCUMENT`, a
personal note on MongoDB's storage hierarchy, mildly related to Step 3's
subject matter but not itself an implementation), adds a `"traints":
"nodemon --exec ts-node src/train.ts"` script to `package.json`, and
creates `src/train.ts` containing only `console.log("Hello world")`. No
package/dependency changes, no application code. Nothing to carry into
the new project.

**B. Editor/tooling noise** — `9f7bbc9` ("new folder") only adds
`.vscode/extensions.json`. Not application architecture; adopt your own
editor config in the new project if wanted, no dependency on it.

---

## §3. Steps

### Step 1 — Initial Setup
```
COMMIT: 2d7ff6d — "feat: initial setup"
```
**PURPOSE:** Establish the bare TypeScript + Node.js project skeleton that
every later step builds on top of.

**DEPENDENCIES:** None — this is the root.

**IMPLEMENTATION:**
- `package.json`: name/version/description, `main: src/server.ts`, scripts
  `start` (`ts-node src/server.ts`), `start:dev` (`nodemon --exec ts-node
  src/server.ts`), `build` (`tsc`), `test` (placeholder).
- `devDependencies`: `typescript`, `ts-node`, `nodemon`, `tsconfig-paths`.
- `tsconfig.json`: `target: ES2020`, `module: commonjs`, `outDir: ./dist`,
  `strict: true`, `esModuleInterop: true`, `skipLibCheck: true`,
  `forceConsistentCasingInFileNames: true`, `baseUrl: ./`,
  `include: ["src/**/*.ts"]`.
- `.gitignore`: ignore `node_modules`, `dist`, `.env`.
- `src/server.ts`: trivial entry point proving the toolchain works (a single
  console.log + one throwaway import to confirm a third-party package
  resolves — in the original this was `moment`).

**ARCHITECTURE:** CommonJS module system, `strict` TypeScript from day one
(not added later), compiled output goes to `dist/`, dev loop is
`nodemon + ts-node` (no separate watch/build step needed in dev).

**VALIDATION:** `npm install` succeeds; `npm run start:dev` runs and prints
the console.log without TS errors; `npm run build` produces `dist/`.

**ONLY PROCEED WHEN:** the toolchain runs cleanly with zero real
application code yet — this step must NOT contain Express, MongoDB, or any
domain logic.

**NEXT STEP:** Step 2 — Environment variables.

---

### Step 1a — TypeScript fundamentals reference (optional, no implementation)
```
COMMIT: 29670b0 — "feat: learningabout patterns"
```
**PURPOSE:** Not a feature step. The entire diff (75 insertions in
`server.ts`) is **commented-out** TypeScript syntax notes — the previous
working demo code (the `moment` import/console.log from Step 1) is itself
commented out and replaced by a scratchpad of:
- primitive vs. object types, union types (`number | string`)
- an `interface Person { name, age, nation }` example
- typed arrays (`string[]`, `(number|string)[]`)
- a `class Person` with constructor
- a closing list of **architecture vocabulary**: `MVC` (Model-View-
  Controller), `DI` (Dependency Injection), `MVP` (Model-View-Presenter),
  and design patterns `Middleware`, `Decorator`

**DEPENDENCIES:** Step 1.

**NEW PACKAGES:** None. Zero `package.json`/`package-lock.json` changes —
this commit touches only `src/server.ts`, and only inside comments.

**IMPLEMENTATION:** Nothing to implement in a target project — there is no
executable change here. If you want the equivalent in the new project, it
would be a personal `NOTES.md`/scratch file, not application code, and it
is **not a dependency of any later step**.

**ARCHITECTURE:** Notable only because the vocabulary listed here (MVC-
style layering, DI-flavored service instantiation, Middleware pattern)
foreshadows the real conventions established in Steps 6-9 — the author was
naming the pattern before building it. No architectural decision is
actually made in this commit itself.

**VALIDATION:** N/A — no behavior to test.

**ONLY PROCEED WHEN:** N/A — this step can be skipped entirely without
affecting anything downstream.

**NEXT STEP:** Step 2 — Environment variables (Step 1a is a side-note, not
a prerequisite).

---

### Step 2 — Environment variables
```
COMMIT: 80e3a7c — "feat: integration of environmental variables"
```
**PURPOSE:** Introduce `.env`-driven configuration before any service
(DB, server) that will need secrets/config is wired up.

**DEPENDENCIES:** Step 1.

**IMPLEMENTATION** (verified from the full diff):
- Add dependency `dotenv` — original pinned `^16.0.0`; **latest is `17.4.2`**
  (see §7 for the full version table). `dotenv.config()` is called at the
  very top of `server.ts`, before anything else.
- `src/server.ts` is stripped down to just `import dotenv... ;
  dotenv.config();` plus two commented-out sanity-check lines
  (`console.log("PORT:", process.env.PORT)` /
  `console.log("MONGO_URL:", process.env.MONGO_URL)` — left commented as a
  manual-check reminder, not active code).
- The Step 1a learning-notes block that had been living inside
  `server.ts` is **moved verbatim** into a brand-new `comment.ts` at the
  project root (not `src/`) — this is a pure file-relocation, no content
  change, done so `server.ts` can become the real entry point without
  losing the notes. `comment.ts` plays no runtime role (never imported by
  anything) — it's a permanent scratch/reference file for the rest of the
  project's history.
- `tsconfig.json` changes **module resolution strategy**:
  `module: "commonjs"` → `module: "NodeNext"`, adds
  `moduleResolution: "NodeNext"` and `rootDir: "./src"`; **removes**
  `baseUrl`/`paths` (the `node_modules/*` path-mapping from Step 1,
  which nothing had actually used yet).

**ARCHITECTURE:** Config-from-environment pattern established early;
`.env` is git-ignored (already covered by Step 1's `.gitignore`). No env
values are hardcoded anywhere from this point forward. The
`NodeNext`/`NodeNext` module switch is a real, load-bearing config
decision made *here*, not at Step 1 — it changes how relative imports and
package `exports` fields resolve for the rest of the project. If adapting
to the **latest** TypeScript (§7: `5.2.2` → `7.0.2`), re-verify this
setting still behaves as expected — `NodeNext` resolution is stricter
about file extensions on relative imports in pure-ESM contexts; since this
project stays CommonJS-at-runtime (`ts-node`, `require`-based `express`
etc.), confirm `tsc --noEmit` and `ts-node` both still run clean after
upgrading before treating this step as done.

**VALIDATION:** Adding a variable to `.env` and reading `process.env.X`
from `server.ts` returns the value at runtime; `npm run build` still
succeeds under the new `tsconfig.json` module settings; `comment.ts`
compiles (or is excluded) without breaking the build.

**ONLY PROCEED WHEN:** `.env` loads correctly, the build still succeeds
under `NodeNext`, and nothing else in the app depends on env vars yet
(DB/server don't exist yet).

**NEXT STEP:** Step 3 — MongoDB connection.

---

### Step 3 — MongoDB connection (Mongoose)
```
COMMIT: 273c849 — "feat: connect mongodb via mongoose"
```
**PURPOSE:** Establish the database connection as a precondition for
starting the HTTP server — the app should refuse to serve traffic if the DB
is unreachable.

**DEPENDENCIES:** Step 2 (needs `MONGO_URL` from `.env`).

**IMPLEMENTATION:** Add `mongoose`. In `server.ts`:
`mongoose.connect(process.env.MONGO_URL as string, {})`, `.then(...)` starts
the server, `.catch(...)` logs and does NOT start the server.

**ARCHITECTURE:** **DB-first bootstrap** — the connect→then(start server)
chain becomes the permanent shape of the entry point for the rest of the
project's life (later steps only add more setup *inside* the `.then`, never
bypass it).

**VALIDATION:** With a valid `MONGO_URL`, server starts and logs a success
message; with an invalid one, server does NOT start and logs the error.

**ONLY PROCEED WHEN:** the connect/fail branching is in place. Express
doesn't exist yet — that's fine, `app.listen`-equivalent can be a stub.

**NEXT STEP:** Step 4 — Express integration.

---

### Step 4 — Express integration
```
COMMIT: c362fa8 — "feat: express integration"
```
**PURPOSE:** Introduce the HTTP framework and split "app construction" from
"process bootstrap" into two files.

**DEPENDENCIES:** Step 3.

**IMPLEMENTATION:** Add `express`. Create `src/app.ts` exporting a
configured `express()` instance (`export default app`). `server.ts` now
only: loads env → connects Mongo → imports `app` → `app.listen(PORT)`.

**ARCHITECTURE:** **`app.ts` / `server.ts` split** — `app.ts` = pure
Express wiring (importable, testable, no side effects on import beyond
building the app); `server.ts` = process entry point (env, DB, listen).
This separation is load-bearing for every later step: all middleware,
routers, and view config get added to `app.ts`, never `server.ts`.

**VALIDATION:** `npm run start:dev` connects to Mongo, then starts Express
and logs the listening port.

**ONLY PROCEED WHEN:** the split is clean — `server.ts` has no Express
config in it, `app.ts` has no `.listen()` call in it.

**NEXT STEP:** Step 5 — Router + first controller.

---

### Step 5 — Router and Member controller skeleton
```
COMMIT: aa6989f — "feat: create router and member controller"
```
**PURPOSE:** Establish the routing layer and the controller-object pattern
before any real domain logic exists.

**DEPENDENCIES:** Step 4.

**IMPLEMENTATION:** Create `src/router.ts` (`express.Router()`, mounted in
`app.ts` at `/`). Create `src/controllers/member.controller.ts` exporting a
plain object (`const memberController: T = {}`) whose methods are assigned
individually (`memberController.getHome = ...`) rather than a class — this
keeps each handler independently testable/assignable. Introduce
`src/libs/types/common.ts` with a generic index type `T` (`{ [key:
string]: any }`) used to type these handler-bag objects.

**ARCHITECTURE:** **Controller = plain object of handlers**, not a class
with `this` — this convention is used for every controller for the rest of
the project (`member`, `product`, `order`, `restaurant`). Router files only
wire `path + method → controller.method`; they contain no logic themselves.

**VALIDATION:** Hitting the registered route returns the controller's
response.

**ONLY PROCEED WHEN:** the object-literal controller pattern + `T` type are
in place, since Step 6 immediately duplicates this pattern for a second
controller.

**NEXT STEP:** Step 6 — Split SPA vs admin routing.

---

### Step 6 — Split routing: SPA router vs Admin router
```
COMMIT: 1c30efe — "fix: modify routing system and controllers"
```
**PURPOSE:** Establish the project's central architectural fork: one
REST API surface for a JS/SPA frontend, one server-rendered surface for an
admin backoffice — as two separate Express Routers from the start.

**DEPENDENCIES:** Step 5.

**IMPLEMENTATION** (verified against the full diff, and adapted for
bookStore — see naming note below):
- `src/routerAdmin.ts` created (later renamed, see Step 11) — same
  shape as `router.ts`: `express.Router()`, three GET routes
  (`/`, `/login`, `/signup`) pointing at the new admin controller.
- `src/controllers/admin.controller.ts` created — **bookStore naming
  adaptation**: the original names this `restaurant.controller.ts` /
  `restaurantController` (the original app's single privileged account
  is a "restaurant"); for bookStore this is renamed to
  `admin.controller.ts` / `adminController` (the bookstore's privileged
  account = the store admin). **Apply this same
  `restaurant → admin` substitution in every later step that references
  `restaurant.controller.ts` / `restaurantController` /
  `RESTAURANT` enum member** (Steps 9-41+) — keep it consistent for the
  rest of the workflow.
- `src/controllers/member.controller.ts`'s three page-serving handlers
  (`goHome`/`getLogin`/`getSignup`) are **commented out** (not deleted),
  with a `// REACT` marker comment added above the (now-empty) object —
  signals that the SPA side will be a React client and no longer needs
  server-rendered pages; `member.controller.ts` becomes a home for
  JSON-API handlers only, starting Step 12+.
- `src/router.ts`'s three matching GET routes are commented out too
  (handlers they pointed to no longer exist as active code).
- `app.ts`: add `import routerAdmin from "./routerAdmin"`; mount
  `app.use("/admin", routerAdmin)` **before** `app.use("/", router)`,
  with inline comments `// SSR: EJS` / `// SPA: REACT / Middleware design
  patter[n]` — both preserved from the original, documenting *why* each
  router exists side by side.

**ARCHITECTURE:** **Dual-interface architecture**:
- `router.ts` + `*.controller.ts` (member/product/order) → JSON REST API,
  consumed by an SPA frontend, JWT-cookie auth (built in Steps 42-45).
- `router-admin.ts` + `admin.controller.ts` → server-rendered EJS
  admin panel, session-cookie auth (built in Steps 18-21), restricted to
  one privileged member type.
Both surfaces share the same models/services underneath — they are two
views onto the same domain, not two backends. Keep this split even if the
target project's frontend approach differs (e.g. both could be REST APIs
for two different clients) — the point is: **admin/privileged operations
and public/user operations are architecturally separated at the router
level from the very beginning**, not bolted on later with role checks
scattered through one router. **The SPA controller's page-handlers are
retired in favor of a future JSON API, not left as dead competing routes**
— comment them out rather than leaving both a page-serving and a
future JSON handler under the same route.

**VALIDATION (bookStore, confirmed by running the server):**
```
GET /admin        → "Home Page"
GET /admin/login  → "Login Page"
GET /admin/signup → "Signup Page"
GET /             → 404 (SPA page-routes intentionally disabled)
```
`npm run build` passes with no errors despite the unused
`memberController`/import in `router.ts` (tsconfig has no
`noUnusedLocals`/`noUnusedParameters`, matching the original).

**ONLY PROCEED WHEN:** the two-router split exists and is mounted, since
every later routing step attaches to one or the other specifically.

**NEXT STEP:** Step 7 — Service layer for Member.

---

### Step 7 — Member service layer
```
COMMIT: 968d5d8 — "feat: Member dervice model integration"
```
**PURPOSE:** Introduce the service layer as the mandatory boundary between
controllers and the database — controllers must never touch Mongoose
directly.

**DEPENDENCIES:** Step 6.

**IMPLEMENTATION** (verified against the full diff — smaller than it
sounds): `src/models/Member.service.ts` is created as an **empty class
stub** — just `class MemberService { constructor() {} }`, no methods yet.
`admin.controller.ts` (bookStore's rename of `restaurant.controller.ts`,
per §0a) gets one new line: `import MemberService from
"../models/Member.service"` — **imported but not yet instantiated**; the
`const memberService = new MemberService()` + actual method calls don't
appear until Step 12 (signup). No `Member` naming adaptation needed here
— `Member` is domain-neutral per §0a.

**PATTERN ESTABLISHED HERE, USED FROM STEP 12 ONWARD:** once real methods
exist, each controller file instantiates its own service once at module
scope (`const memberService = new MemberService()`) and calls
`memberService.xxx(...)` — never touches Mongoose directly.

**ARCHITECTURE:** **Layering rule fixed for the rest of the project:**
`router → controller (object-literal, HTTP concerns: req/res/status
codes/try-catch) → service (class, business logic + Mongoose queries) →
schema (Mongoose model)`. Note the asymmetry: controllers are plain objects,
services are classes — this is intentional in the original and should be
kept for fidelity, though either is a valid adaptation.
(Directory is named `models/` for *services* — the actual Mongoose schemas
live in `schema/`, see Step 8. This naming is a known inconsistency in the
original repo; §4 documents it — a target project may rename `models/` →
`services/` for clarity without breaking the workflow logic.)

**VALIDATION:** Controller method delegates to service method; no
`mongoose.model(...)` calls appear inside any `*.controller.ts`.

**ONLY PROCEED WHEN:** the controller→service call boundary is real (even
if the service body is a stub), since Step 8 fills in the actual schema
the service will query.

**NEXT STEP:** Step 8 — Member schema.

---

### Step 8 — Member Mongoose schema
```
COMMIT: 5ee1ff8 — "feat: develop member schema model"
```
**PURPOSE:** Define the first real persisted domain entity.

**DEPENDENCIES:** Step 7 (service exists to consume this schema).

**IMPLEMENTATION:** `src/libs/enums/member.enum.ts`: `MemberType` (`USER |
RESTAURANT`), `MemberStatus` (`ACTIVE | BLOCK | DELETE`). `src/schema/
Member.model.ts`: Mongoose schema with `memberType` (enum, default
`USER`), `memberStatus` (enum, default `ACTIVE`), `memberNick` (unique,
sparse, required), `memberPhone` (unique, sparse, required),
`memberPassword` (`select: false`, required), `memberAddress`,
`memberDesc`, `memberImage`, `memberPoints` (default 0);
`{ timestamps: true }`. Exported via `mongoose.model("Member",
memberSchema)`.

**ARCHITECTURE:** **One Mongoose model serves two roles** (`USER` = regular
customer, `RESTAURANT` = the single admin/business account) via a
discriminator-style `memberType` enum field rather than two collections.
**Soft-delete via status enum** (`DELETE`/`BLOCK` are statuses, not actual
document removal) — every later query that reads members must filter
`memberStatus`. **Points field for a loyalty system** is present from the
schema's inception even though the logic that increments it doesn't arrive
until Step 57.

**VALIDATION:** `MemberModel.create(...)` persists a document with the
declared shape/defaults/uniqueness enforced.

**ONLY PROCEED WHEN:** schema + enums exist and the service from Step 7 is
updated to import this model instead of a stub.

**NEXT STEP:** Step 9 — Cross-cutting error/config standards.

---

### Step 9 — Project standards: centralized errors & config
```
COMMIT: 803d07e — "feat: create project standarts"
```
**PURPOSE:** Before writing any more business logic, fix the project-wide
conventions for error handling, HTTP status codes, and shared config
constants, so every controller from here on follows one pattern instead of
each inventing its own.

**DEPENDENCIES:** Steps 1-8 (needs controllers/services to retrofit).

**IMPLEMENTATION** (corrected against the full diff):
- `src/libs/Error.ts`: `HttpCode` enum (200/201/304/400/401/403/404/500),
  `Message` enum with **only 4 values at this point**
  (`SOMETHING_WENT_WRONG`, `NO_DATA_FOUND`, `CREATE_FAILED`,
  `UPDATE_FAILED` — grows in later steps), `class Errors extends Error {
  code: HttpCode; message: Message; constructor(code, message) {...} }`.
  No `static standard` fallback yet.
- `src/libs/config.ts`: **only `MORGAN_FORMAT`** at this point —
  `AUTH_TIMER`/`shapeIntoMongoseObjectId` come later, when first needed.
- **`morgan` (HTTP request logger) is added here too** — `morgan` +
  `@types/morgan` deps, wired into `app.ts`'s `1 - ENTRANCE` section:
  `app.use(morgan(MORGAN_FORMAT))`.
- Cosmetic: `admin.controller.ts` (bookStore's rename of
  `restaurant.controller.ts`) handlers get a `console.log('<name>')` line
  each — optional, no architectural weight.

No `Product`/`restaurant` naming involved in this step — nothing new to
add to the §0a table here. **API-naming reminder (per user instruction):**
when a step introduces an actual REST endpoint name tied to the original
domain (e.g. Step 49's `getRestaurant`), rename it per §0a
(`getRestaurant → getAdmin`) at the point it's implemented — not before,
since the endpoint doesn't exist yet.

**ARCHITECTURE:** **Uniform controller error contract**: every controller
method wraps its body in `try { ... } catch (err) { if (err instanceof
Errors) res.status(err.code).json(err); else
res.status(Errors.standard.code).json(Errors.standard); }`. Services throw
`new Errors(HttpCode.X, Message.Y)` for expected failure cases (not found,
duplicate, wrong password, etc.); unexpected exceptions fall through to the
generic 500. This is the pattern every subsequent business-logic step
follows exactly — do not introduce a second error-handling style later.

**VALIDATION:** An intentionally-thrown `Errors` in a service surfaces as
the correct HTTP status + message at the controller boundary; an
unexpected thrown error surfaces as a generic 500 without leaking internals.

**ONLY PROCEED WHEN:** `Errors`/`HttpCode`/`Message` exist and at least one
controller has been retrofitted to use them (proves the pattern works
end-to-end).

**NEXT STEP:** Step 10 — Admin router endpoints for the restaurant/member
domain.

---

### Step 10 — Restaurant member router endpoints
```
COMMIT: 3b00365 — "feat: create restaurant member related router get and post endpoints"
```
**PURPOSE:** Start filling in the admin (SSR) router with real
member/restaurant-account endpoints (home, login page, signup page — GET
for pages, POST for form submission, to be filled in over the next steps).

**DEPENDENCIES:** Step 6 (admin router exists), Step 9 (error pattern).

**IMPLEMENTATION** (verified against the full diff): Add
`processLogin`/`processSignup` stub handlers to `admin.controller.ts`
(bookStore rename, §0a) — `res.send("DONE")` bodies, real logic in Steps
12-14. In `routerAdmin.ts`, chain `.get("/login", getLogin).post("/login",
processLogin)` (same for `/signup`). Add section-header comments —
`/** Admin */` (bookStore rename of `/** Restaurant */`) above the routes
just added, then two placeholder headers `/** Book */` (bookStore rename
of `/** Product */`, per §0a) and `/** User */` — pre-declaring where
Step 22's book routes and Step 30's user routes slot in later.

**ARCHITECTURE:** **GET-renders-a-page / POST-processes-the-form** pairing
convention for every SSR admin route pair from here on. Router files get
domain-section comment headers up front, left empty until the
corresponding step fills them.

**VALIDATION:** Routes are registered and reachable (may still return
stub/placeholder responses at this point).

**ONLY PROCEED WHEN:** route wiring exists even if handler bodies are thin.

**NEXT STEP:** Step 11 — Naming convention fix.

---

### Step 11 — File naming convention fix
```
COMMIT: 82903f7 — "fix: router-adming according to naming standarts"
```
**PURPOSE:** Correct the admin router's filename to match the project's
naming convention.

**DEPENDENCIES:** Step 10.

**IMPLEMENTATION:** Rename `src/routerAdmin.ts` → `src/router-admin.ts`
(pure rename, update the one import in `app.ts`). Skip `kill-port` (never
imported anywhere in the original either — see §7).

**ARCHITECTURE:** **Naming convention locked in: kebab-case for
filenames** (`router-admin.ts`, later `member.controller.ts`,
`product.controller.ts`, etc.), PascalCase for classes/schemas
(`MemberService`, `Member.model.ts`), camelCase for
functions/variables/methods. Apply this convention from the start in the
new project rather than retrofitting it later.

**VALIDATION:** Import paths still resolve after rename; app still boots.

**ONLY PROCEED WHEN:** rename is complete and nothing still imports the old
path.

**NEXT STEP:** Step 12 — Signup process.

---

### Step 12 — Admin signup process
```
COMMIT: dcb3a37 — "feat: develop signup process"
```
**PURPOSE:** Implement real signup business logic for the admin
(restaurant-owner) account.

**DEPENDENCIES:** Steps 8 (schema), 9 (errors), 10 (route wiring).

**IMPLEMENTATION** (corrected against the full diff):
- `src/libs/types/member.ts`: `Member` and `MemberInput` interfaces.
  **`LoginInput` not created here** — added in Step 13.
- `MemberService.processSignup(input)`: reject if an `ADMIN`-type member
  already exists (bookStore rename of `RESTAURANT`, §0a —
  **business rule: exactly one admin account allowed**),
  `this.memberModel.create(input)`, blank `result.memberPassword` before
  returning it.
- ⚠️ **`memberPassword` stored as plain text at this point — no `bcrypt`
  yet.** Matches the original exactly; hashing arrives in Step 14. Flag
  this explicitly rather than "fixing" it early, to preserve workflow
  fidelity — Step 14 is where this gets corrected.
- `adminController.processSignup` becomes `async`; instantiates
  `const memberService = new MemberService()` **inline inside the
  handler** (module-scope singleton comes later, untracked exact commit).
  Errors caught and sent raw: `res.send(err)`.

**ARCHITECTURE:** Signup business logic lives in the service layer, never
the controller. Passwords are stripped from the *response* — but that is
currently the only protection; not cryptographically protected at rest
until Step 14.

**§7 mongoose-9 breaking change, hit for real at this step (bookStore):**
returning `this.memberModel.create(input)` as `Promise<Member>` failed to
typecheck under mongoose `^9.9.2`. Fixed by: (1) in `libs/types/member.ts`,
`_id: mongoose.Types.ObjectId` instead of `import { ObjectId } from
"mongoose"` (that import no longer resolves to the runtime value type in
mongoose 9); (2) `Member.service.ts`'s `processSignup` returns
`result as unknown as Member` instead of the bare Document (mongoose 9's
auto-inferred type allows `string | null` on optional fields where our
hand-written interface only allows `string | undefined`). **Apply the same
two fixes proactively in Book/Order/View services** when those steps
arrive — don't wait to hit the same build error again.

**VALIDATION:** First signup succeeds; a second attempt to create a
`RESTAURANT` member is rejected with the correct `Errors`.

**ONLY PROCEED WHEN:** the single-restaurant-account rule is enforced and
verified.

**NEXT STEP:** Step 13 — Login process.

---

### Step 13 — Admin login process
```
COMMIT: 0cdc7b7 — "feat: develop restaurant login process"
```
**PURPOSE:** Implement credential verification for the admin account.

**DEPENDENCIES:** Step 12.

**IMPLEMENTATION** (corrected against the full diff):
- `src/libs/types/member.ts`: `LoginInput` (`memberNick`,
  `memberPassword`).
- `Message` enum gains `USED_NICK_PHONE`, `NO_MEMBER_NICK`,
  `WRONG_PASSWORD`.
- `MemberService.processLogin(input)`: find by `memberNick` (projecting
  `memberNick`+`memberPassword`), 404 (`NO_MEMBER_NICK`) if not found.
  ⚠️ **Plain string equality, not `bcrypt.compare`** —
  `input.memberPassword === member.memberPassword` (Step 12 still hasn't
  hashed anything). 401 (`WRONG_PASSWORD`) on mismatch, else
  `findById(member._id).exec()`. **No `memberStatus`/blocked-member check
  yet.**
- `adminController.processLogin` becomes `async`, same inline-service +
  raw-`res.send(...)` shape as `processSignup`.

**ARCHITECTURE:** Login fetches a minimal projected document first, then
a full re-fetch by id on success. The response omits the password because
`memberPassword` has `select: false` in the schema (Step 8) — schema-level
protection, not something this step's code does itself. Remember to apply
the `mongoose.Types.ObjectId` / `as unknown as Member` adaptation from
Step 12 here too if the return type ever fights the compiler the same way.

**VALIDATION:** Correct credentials log in; wrong password / unknown nick
return the correct distinct `Errors`.

**ONLY PROCEED WHEN:** both failure branches and the success branch are
individually verified.

**NEXT STEP:** Step 14 — Login/signup refinement.

---

### Step 14 — Fix: login/signup refinement
```
COMMIT: 01ea3a1 — "fix: modify restaurant login and signup process"
```
**PURPOSE:** Bugfix pass on Steps 12-13 (exact delta: minor query/response
shape corrections in `MemberService`).

**DEPENDENCIES:** Steps 12, 13.

**IMPLEMENTATION:** Re-inspect `processSignup`/`processLogin` against real
usage and correct field selection / error branch. Treat as: whatever manual
testing of Steps 12-13 reveals as wrong, fix here before moving on.

**ARCHITECTURE:** No new architecture — this step exists to record that
verification of Steps 12-13 surfaced real bugs. **Lesson for the workflow**:
budget a fix-pass step after any non-trivial auth logic step.

**VALIDATION:** Re-run Step 12/13's validation; both still pass, plus
whatever edge case prompted this fix.

**ONLY PROCEED WHEN:** signup+login are solid, since Step 15 will split
this logic into a second (SPA) code path that must not repeat the same bug.

**NEXT STEP:** Step 15 — Split SPA vs SSR business logic.

---

### Step 15 — Organize SPA vs SSR business logic
```
COMMIT: ab77ed7 — "fix: organize spa & ssr business logic"
```
**PURPOSE:** Give the SPA-facing `member.controller.ts` its own
signup/login logic, diverging cleanly from the SSR
`restaurant.controller.ts` path (which is admin-only, session-based),
instead of sharing one code path for two different auth mechanisms.

**DEPENDENCIES:** Step 6 (dual router split), Steps 12-14 (SSR
signup/login as the reference to diverge from).

**IMPLEMENTATION:** Add `signup`/`login` to `MemberService` (SPA versions:
same bcrypt hash/compare logic as `processSignup`/`processLogin`, but
returning JSON directly rather than doing a session redirect — the actual
token/cookie issuance is deferred to Step 43). Extend `Errors`/`Message`
with the additional cases needed (blocked user, wrong nick, etc.).

**ARCHITECTURE:** **Confirms the Step 6 fork at the service level too**:
`signup`/`login` (SPA, public users) vs `processSignup`/`processLogin`
(SSR, restaurant admin) are separate service methods even though their
internal logic (hash/compare) is nearly identical — resist the urge to
merge them, because their surrounding concerns (session vs. token,
member-type constraints) diverge in later steps.

**VALIDATION:** SPA signup/login and SSR signup/login both work
independently, hitting the correct service method.

**ONLY PROCEED WHEN:** the two paths are verified independently.

**NEXT STEP:** Step 16 — Frontend scaffolding.

---

### Step 16 — Frontend scaffolding (CSS/JS/EJS stubs)
```
COMMIT: 8fab998 — "feat: fronted related css, js, and image creation"
```
**PURPOSE:** Stand up the SSR view layer skeleton before wiring real data
into it.

**DEPENDENCIES:** Step 6 (admin router), `ejs` set as view engine (implied
by this step — confirm `app.set("view engine", "ejs")` +
`app.set("views", ...)` + `express.static` for `public/` exist in
`app.ts`).

**IMPLEMENTATION:** `src/views/{home,login,products,signup,users}.ejs`
(stub markup), `src/public/css/main.css`, `src/public/js/main.js`.
`restaurant.controller.ts`'s page-GET handlers now `res.render(...)`
instead of placeholder responses.

**ARCHITECTURE:** One EJS view + one purpose-specific CSS/JS file per admin
page, all served from `src/public/` as static assets. This 1:1
view↔asset-file convention continues through Step 32.

**VALIDATION:** Each admin page renders its corresponding stub view without
error.

**ONLY PROCEED WHEN:** all 5 admin views render.

**NEXT STEP:** Step 17 — Header/footer partials.

---

### Step 17 — Admin layout: header/footer partials
```
COMMIT: f7ff4d3 — "feat: develop admin frontend pages and integrate header and footer"
```
**PURPOSE:** De-duplicate shared page chrome across the 5 admin views.

**DEPENDENCIES:** Step 16.

**IMPLEMENTATION:** `src/views/includes/{header,footer}.ejs`, included via
EJS `<%- include(...) %>` in every page view; trim the now-duplicated
markup out of each individual view.

**ARCHITECTURE:** **Shared-partial convention** for the SSR view layer —
any markup used on 2+ pages moves to `views/includes/`.

**VALIDATION:** All 5 pages still render correctly and now share identical
header/footer.

**DEVIATION CAUGHT (2026-08-30):** `footer.ejs` briefly held `</body></html>`
while every page view also closed its own `</body>` — a duplicate-tag bug
not present in burak's actual `f7ff4d3` (whose `footer.ejs` is only
`</html>`, since each page closes its own `<body>`). Confirmed via a live
render (`curl` showed two `</body>` lines) and fixed by trimming
`footer.ejs` back to just `</html>`, matching burak's real commit.

**ONLY PROCEED WHEN:** no page has inline-duplicated header/footer markup
left.

**NEXT STEP:** Step 18 — Session middleware.

---

### Step 18 — Session middleware integration
```
COMMIT: 477e431 — "feat: integrate middleware sessions"
```
**PURPOSE:** Add server-side session support as the auth mechanism for the
SSR admin surface (distinct from the JWT-cookie mechanism the SPA surface
will get in Step 42+).

**DEPENDENCIES:** Step 3 (Mongo connection, session store lives in Mongo),
Step 4 (`app.ts`).

**IMPLEMENTATION:** Add `express-session` + `connect-mongo` (**deviation
from burak**: burak's own history uses `connect-mongodb-session`, but that
package bundles its own `bson@6.x` which conflicts with `mongoose@9`'s
`bson@7.x` — throws "Unsupported BSON version" inside `session.save()`,
silently dropping `req.session.member` while the redirect still fires.
`connect-mongo` shares mongoose's own driver tree, so no separate BSON
version exists to conflict; burak avoids this only because its own
`mongoose@^6.2.9` + `connect-mongodb-session@^3.1.1` happen to share one
`bson@4.7.2`). In `app.ts`: build the store via `MongoStore.create({
mongoUrl: MONGO_URL, collectionName: "sessions" })`, register
`session({ secret: SESSION_SECRET, cookie: { maxAge }, store, resave:
true, saveUninitialized: true })` **before** the routers are mounted. Add
a small middleware right after that copies `req.session.member` onto
`res.locals.member` so every EJS view can read the logged-in member
without each controller passing it explicitly. `SESSION_SECRET` added to
`.env` (extends Step 2).

**ARCHITECTURE:** **Two parallel, independent auth mechanisms by design**:
admin/SSR = server-side session in Mongo; SPA/API = stateless JWT in a
cookie (built starting Step 42). Do not let them share storage or
verification code — they protect different routers and have different
trust models (session = "this browser has an active login"; JWT =
"bearer of a signed, time-limited claim").

**VALIDATION:** A session cookie is set on first request, persists across
requests, and is stored in the `sessions` Mongo collection.

**ONLY PROCEED WHEN:** the store is confirmed to be Mongo-backed (not
memory — memory sessions would not survive a server restart, which matters
for the admin panel).

**NEXT STEP:** Step 19 — Populate the session on login/signup.

---

### Step 19 — Create sessions on login/signup
```
COMMIT: 89122f5 — "fix: create sessions on login and signup process"
```
**PURPOSE:** Actually populate `req.session.member` after a successful
admin login/signup (Step 18 only added the middleware plumbing).

**DEPENDENCIES:** Steps 12-14 (login/signup logic), Step 18 (session
middleware).

**IMPLEMENTATION:** In `processLogin`/`processSignup`: on success, `req
.session.member = result; req.session.save(() => res.redirect(...))` —
note the redirect happens **inside** the `save` callback, not after it
synchronously, to guarantee the session is persisted before the browser
follows the redirect.

**ARCHITECTURE:** **Session-write-then-redirect must be sequenced through
the save callback** — this exact pattern repeats for every SSR
login/signup path; do not redirect before `save()`'s callback fires.

**VALIDATION:** After login, `res.locals.member` (Step 18) is populated on
the very next page render — no "logged in but header still shows
logged-out" race.

**ONLY PROCEED WHEN:** the redirect-after-save ordering is verified (this
is the kind of bug that's invisible in fast local testing and shows up
under latency).

**NEXT STEP:** Step 20 — Session check endpoint.

---

### Step 20 — checkAuthSession endpoint
```
COMMIT: 0f99ff5 — "feat: create checkAuthSession api"
```
**PURPOSE:** Debug/utility endpoint to introspect the current session
state.

**DEPENDENCIES:** Step 19.

**IMPLEMENTATION:** `GET /admin/check-me` → reads `req.session?.member`,
responds accordingly.

**ARCHITECTURE:** Minor, but establishes optional-chaining (`req.session?
.member`) as the safe way to read session data that may not exist —
carried forward into the real auth-gate middleware in Step 21+/44.

**VALIDATION:** Endpoint reflects actual login state correctly in both
directions.

**ONLY PROCEED WHEN:** verified in both logged-in and logged-out states.

**NEXT STEP:** Step 21 — Admin logout.

---

### Step 21 — Admin logout process
```
COMMIT: 1f31319 — "feat: develop logout process"
```
**PURPOSE:** Terminate an admin session.

**DEPENDENCIES:** Step 18.

**IMPLEMENTATION:** `GET /admin/logout` → `req.session.destroy(() => res
.redirect("/admin"))`.

**ARCHITECTURE:** Same "act inside the callback" discipline as Step 19,
now for destruction instead of creation.

**VALIDATION:** After logout, `check-me` (Step 20) reports logged-out, and
protected admin pages (once Step 22+ adds the guard) reject access.

**ONLY PROCEED WHEN:** verified end-to-end (login → confirm session →
logout → confirm session gone).

**NEXT STEP:** Step 22 — Product controller/router skeleton.

---

### Step 22 — Product controller + routing skeleton
```
COMMIT: 3333bbf — "feat: create product controller and product routing apis"
```
**PURPOSE:** Start the second domain entity (Product) using the exact same
layered pattern established for Member (Steps 5, 7).

**DEPENDENCIES:** Steps 5-9 (pattern to replicate).

**IMPLEMENTATION:** `src/controllers/product.controller.ts`
(object-literal), `src/models/Product.service.ts` (class, stub), admin
router entries for product listing, `src/schema/Product.model.ts` created
empty (filled in Step 25).

**ARCHITECTURE:** **Confirms Member's pattern is the project-wide
convention**, not a one-off: every domain (Member, Product, later Order,
View) gets the same four files —
`controller` (object) / `service` (class) / `schema` (Mongoose model) /
`types` (interfaces) — plus an `enum` file if it has status/category
fields.

**VALIDATION:** Route reachable, calling into the (still-stub) service.

**ONLY PROCEED WHEN:** the 4-file pattern is replicated correctly for
Product before real logic is added.

**NEXT STEP:** Step 23 — res.locals plumbing.

---

### Step 23 — `res.locals` integration
```
COMMIT: 1f8c8fc — "feat: locals variable integration"
```
**PURPOSE:** Make cross-cutting view data (e.g. product list counts, active
nav state) available to EJS templates without every controller passing it
explicitly.

**DEPENDENCIES:** Step 18 (established the `res.locals.member` pattern),
Step 22.

**IMPLEMENTATION:** Extend the `app.ts` locals-setting middleware and/or
add per-route locals assignment before `res.render`.

**ARCHITECTURE:** `res.locals` is the sanctioned channel for "ambient" view
data (current member, nav state); explicit `res.render(view, {data})`
remains for page-specific data (e.g. the actual product list). Don't mix
the two purposes.

**VALIDATION:** Views render correct ambient state without each controller
duplicating the same lookup.

**ONLY PROCEED WHEN:** verified across at least two different admin pages.

**NEXT STEP:** Step 24 — File upload (Multer).

---

### Step 24 — File upload via Multer
```
COMMIT: 1e98bf0 — "feat: upload files into server via multer"
```
**PURPOSE:** Enable image upload for member/product records, needed before
signup (member image) and product-create (product images) can be
finished.

**DEPENDENCIES:** Step 4 (Express app to attach middleware to).

**IMPLEMENTATION:** Add `multer` + `uuid`. `src/libs/utils/uploader.ts`:
`makeUploader(address: string)` factory returning a configured
`multer({ storage: diskStorage })` instance — `destination:
./uploads/${address}`, `filename: uuid() + original extension`. Mount
`/uploads` as a static route in `app.ts` so uploaded files are servable.
Add `uploads/` handling to `.gitignore` policy (the directory itself is
kept, generated files are not necessarily committed — see original repo's
actual `.gitignore`, which does NOT ignore `uploads/`, meaning uploaded
files ARE tracked; decide deliberately for the new project rather than
copying this by accident).

**ARCHITECTURE:** **One reusable uploader factory parameterized by
destination folder** (`uploader("members")`, `uploader("products")`),
rather than one hardcoded Multer config per entity. Filenames are always
randomized (`uuid + ext`) — never trust/store the original filename, both
for collision-avoidance and basic path-safety.

**VALIDATION:** A multipart upload lands in the correct
`uploads/<address>/` folder with a uuid filename, and is reachable at
`/uploads/<address>/<uuid>.<ext>`.

**ONLY PROCEED WHEN:** upload works for at least one route (wired into
signup/product-create in Steps 27 and member-update in Step 47).

**NEXT STEP:** Step 25 — Product schema.

---

### Step 25 — Product Mongoose schema
```
COMMIT: 0423d23 — "feat: configuration product Schema model"
```
**PURPOSE:** Define the Product domain entity fully.

**DEPENDENCIES:** Step 22 (service/controller stubs to fill in).

**IMPLEMENTATION:** `src/libs/enums/product.enum.ts`: `ProductSize`
(SMALL/NORMAL/LARGE/SET), `ProductVolume` (numeric enum 0.5/1/1.2/1.5/2),
`ProductStatus` (PAUSE/PROCESS/DELETE), `ProductCollection`
(DISH/SALAD/DESSERT/DRINK/OTHER). `src/schema/Product.model.ts`: all
fields + a **compound unique index** on `(productName, productSize,
productVolume)` — same product name is allowed to exist multiple times
only if size/volume differ.

**ARCHITECTURE:** Same soft-status pattern as Member (`ProductStatus
.PAUSE` default = not yet visible to customers; `.PROCESS` = live;
`.DELETE` = soft-deleted). Compound uniqueness instead of single-field
uniqueness — a deliberate, non-obvious constraint; document it explicitly
in the new project too so it isn't "fixed" away accidentally later.

**VALIDATION:** Creating two products with identical name+size+volume
fails at the DB layer; identical name with different size succeeds.

**ONLY PROCEED WHEN:** the compound index behavior is confirmed.

**NEXT STEP:** Step 26 — Signup/login fix pass #2.

---

### Step 26 — Fix: processSignup/processLogin refinement
```
COMMIT: b45072d — "fix: modify restaurant controller processSignup and processLogin"
```
**PURPOSE:** Second bugfix pass on admin signup/login, this time informed
by the file-upload work from Step 24 (member image is now part of signup).

**DEPENDENCIES:** Steps 12-14, 24.

**IMPLEMENTATION:** Correct how `req.file` (Multer) is read/validated in
`processSignup`, and any related response-shape fix in `processLogin`.

**ARCHITECTURE:** No new architecture; reinforces the "verify after wiring
a cross-cutting concern into an existing flow" habit (same as Step 14).

**VALIDATION:** Signup with an image attached succeeds and stores the
correct `memberImage` path; signup without an image is rejected with the
correct `Errors`.

**ONLY PROCEED WHEN:** verified with and without an uploaded file.

**NEXT STEP:** Step 27 — Create product (admin).

---

### Step 27 — createNewProduct business logic
```
COMMIT: 469e297 — "feat: createNewProduct business logic by restaurant member"
```
**PURPOSE:** Let the admin actually create products, including multi-image
upload.

**DEPENDENCIES:** Steps 24 (upload), 25 (schema).

**IMPLEMENTATION:** `src/libs/types/product.ts`: `ProductInput`,
`ProductInquiry`, `ProductUpdateInput`. Admin route:
`uploader("products").array("productImages", 5)` (up to 5 images) → 
controller reads `req.files`, maps each to `.path`, calls `productService
.createNewProduct`. On success/failure, respond with an inline `<script>
alert(...); window.location.replace(...)</script>` (SSR-style
flash-message-via-redirect, no separate flash middleware).

**ARCHITECTURE:** **SSR "flash via inline script" pattern**: instead of a
`connect-flash`-style library, success/error feedback on form submission
is done by sending a tiny HTML response that alerts then redirects. This
repeats for every admin form-POST from here on (product create/update,
user update). Keep this in mind when adapting to a different frontend —
an SPA target would replace this entirely with a JSON response + client-side
toast, but the underlying "operation result must reach the user
synchronously after form submit" requirement is the same.

**VALIDATION:** Creating a product with 1-5 images succeeds and all image
paths are stored; 0 images is rejected.

**ONLY PROCEED WHEN:** verified with min/max image counts.

**NEXT STEP:** Step 28 — Update product.

---

### Step 28 — updateChosenProduct business logic
```
COMMIT: 6185f42 — "feat: modify updateChosenProduct business logic"
```
**PURPOSE:** Admin can edit an existing product.

**DEPENDENCIES:** Step 27.

**IMPLEMENTATION:** `ProductService.updatedChosenProduct(id, input)`:
`shapeIntoMongoseObjectId` the id (Step 9's helper), `findOneAndUpdate({
new: true })`, throw `NOT_MODIFIED` if nothing matched.

**ARCHITECTURE:** **Standard update-service shape**, reused verbatim
pattern for every subsequent "update X" step (`updateMember`,
`updateChosenUser`, `updateOrder`): coerce id → `findOneAndUpdate({new:
true})` → throw `Errors(NOT_MODIFIED, UPDATE_FAILED)` if `null`.

**VALIDATION:** Valid id updates the document and returns the new version;
invalid/non-matching id throws the correct error.

**ONLY PROCEED WHEN:** verified.

**NEXT STEP:** Step 29 — Product listing + EJS data.

---

### Step 29 — Fix: getAllProducts + EJS data
```
COMMIT: 6e212b7 — "fix: getAllProducts api and passing data into ejs"
```
**PURPOSE:** Admin product list page actually shows real data.

**DEPENDENCIES:** Step 25.

**IMPLEMENTATION:** `ProductService.getAllProducts()` (simple `.find()`,
all statuses — admin sees everything including paused/deleted, unlike the
public SPA endpoint from Step 50 which filters to `PROCESS` only).
Controller: `res.render("products", { products: data })`.

**ARCHITECTURE:** Confirms the **admin views see unfiltered data, public
API views see status-filtered data** distinction — a recurring rule (also
applies to Users in Step 30 vs the public member-facing endpoints).

**VALIDATION:** Admin products page lists every product regardless of
status.

**ONLY PROCEED WHEN:** verified against products in more than one status.

**NEXT STEP:** Step 30 — Users list (admin).

---

### Step 30 — getUsers business logic
```
COMMIT: 27bdc3c — "feat: develop getUsers business logic"
```
**PURPOSE:** Admin user-management list page.

**DEPENDENCIES:** Step 8 (Member schema).

**IMPLEMENTATION:** `MemberService.getUsers()`: `find({ memberType:
MemberType.USER })` (excludes the restaurant/admin account itself).
Admin route + view render.

**ARCHITECTURE:** Confirms `memberType` is the correct filter for
"customer-facing" queries, not `memberStatus` — status handles
active/blocked/deleted, type handles role.

**VALIDATION:** List shows only `USER`-type members, never the
`RESTAURANT` account.

**ONLY PROCEED WHEN:** verified.

**NEXT STEP:** Step 31 — Update user (admin).

---

### Step 31 — updateChosenUser api
```
COMMIT: 3772973 — "feat: develop updateChosenUser api"
```
**PURPOSE:** Admin can change a user's status (e.g. block a user) or other
editable fields.

**DEPENDENCIES:** Step 28's update pattern, Step 30.

**IMPLEMENTATION:** `MemberService.updateChosenUser(input)`: same
find-and-update-by-id shape as Step 28, applied to Member.

**ARCHITECTURE:** No new pattern — direct reuse of Step 28's update
convention. This is the point in the sequence where the update-pattern
starts paying for itself across domains.

**VALIDATION:** Status change (e.g. → `BLOCK`) persists and is enforced by
Step 13's login check (`BLOCKED_USER`).

**ONLY PROCEED WHEN:** verified that blocking a user actually prevents
their subsequent login.

**NEXT STEP:** Step 32 — Full admin frontend pass.

---

### Step 32 — Admin frontend publishing (full CSS/JS/EJS pass)
```
COMMIT: 997f588 — "fix: admin frontend publishing"
```
**PURPOSE:** Turn every admin page from a functional stub into a complete
UI: full CSS for all 5 pages, real images/favicon, JS for each page.

**DEPENDENCIES:** Steps 16-17 (scaffolding), 22-31 (data now real, styling
it becomes meaningful).

**IMPLEMENTATION:** `src/public/css/{home,login,products,signup,users}
.css`, `src/public/img/{default.jpeg,favicon.png,upload.svg}`, `src/public
/js/{home,products,signup,users}.js`, and a large rewrite of all 5
`views/*.ejs` to consume real data + the new styling.

**ARCHITECTURE:** No new backend architecture — this is a UI-completion
checkpoint. In a target project, this step's *intent* ("once the backend
endpoints for a page are functionally complete, do a dedicated UI-polish
pass before moving to the next domain") is what to preserve, not the CSS
itself.

**VALIDATION:** All 5 admin pages are visually complete and functionally
correct against real backend data.

**ONLY PROCEED WHEN:** manual visual QA of all 5 pages passes.

**DONE EARLY, OUT OF ORDER (2026-08-30):** the Home/Login/Signup slice of
this step (plus Step 33's `signup.js` validation) is already built —
`auth.css`, `home.css`, `signup.css`, `signup.js`, and all 3 views were
rewritten ahead of Steps 22-31, deliberately **not** copying burak's own
CSS/design. Instead they use `bstore-react`'s actual brand tokens (color
`#4285f4`, `Open Sans`, `.bj_theme_btn`-derived button system) scanned
directly from that project's SCSS, since burak's visual design was never
the target look for LightBooks. The signup image-upload widget was also
redesigned away from burak's exact layout (circular avatar + camera icon,
not a direct copy). Still pending: the `products.css`/`users.css`
equivalents (Book/User pages), which can't be built meaningfully until
Steps 22-31 give them real backend data.

**NEXT STEP:** Step 33 — Signup form validation.

---

### Step 33 — Signup frontend validation
```
COMMIT: a9bdbaf — "feat: signup process frontend valdation"
```
**PURPOSE:** Client-side validation before the signup form submits
(password confirmation match, required image, etc.).

**DEPENDENCIES:** Step 32.

**IMPLEMENTATION:** `src/public/js/signup.js`:
`validateSignupForm()` returns `false` (blocking submit) on
password-mismatch or missing image, with `alert()` feedback.

**ARCHITECTURE:** Client-side validation is a UX convenience only — the
server-side checks from Steps 12/26 remain the actual authority and must
never be removed in favor of this.

**VALIDATION:** Submitting with mismatched passwords / no image is blocked
client-side with a clear message.

**ONLY PROCEED WHEN:** verified both failure cases block submission.

**NEXT STEP:** Step 34 — Image preview + upload fix.

---

### Step 34 — memberImage upload preview + validation fix
```
COMMIT: bf1cefa — "fix: memberImage file"
```
**PURPOSE:** Live image preview on file selection, plus tighten the
image-required check from Step 33.

**DEPENDENCIES:** Step 33.

**IMPLEMENTATION:** `signup.js`: on the hidden file input's `change`
event, validate MIME type (jpg/jpeg/png only), then
`URL.createObjectURL(file)` into an `<img>` preview element.

**ARCHITECTURE:** Client-side MIME-type allowlist as a first line of
defense (still not a substitute for server-side validation, which this
project does not add — note this as a gap if reproducing for a
security-sensitive target).

**VALIDATION:** Selecting a valid image shows a live preview; an invalid
file type is rejected with a message before upload.

**ONLY PROCEED WHEN:** verified.

**NEXT STEP:** Step 35 — Product page real-data fix.

---

### Step 35 — Fix: products page real data
```
COMMIT: e6d5ed1 — "fix: modify productspage based on products data"
```
**PURPOSE:** Correct a data-shape mismatch between `getAllProducts`
(Step 29) and what `products.ejs` expects.

**DEPENDENCIES:** Step 29, Step 32.

**IMPLEMENTATION:** Adjust controller response shape and the EJS template
loop accordingly.

**ARCHITECTURE:** No new pattern — a UI/data-contract bugfix.

**VALIDATION:** Products page renders correctly for the actual data shape
the service returns.

**ONLY PROCEED WHEN:** verified.

**NEXT STEP:** Step 36 — Create-product frontend.

---

### Step 36 — New-product frontend logic
```
COMMIT: 3ea44f6 — "feat: create new product frontend logic develop"
```
**PURPOSE:** Client-side JS for the admin "create product" form/modal
(image preview for multiple files, form assembly).

**DEPENDENCIES:** Step 27 (backend), Step 32 (styling baseline).

**IMPLEMENTATION:** `src/public/js/products.js`: multi-image preview
handling, form-submit wiring for `POST /admin/product/create`.

**VALIDATION:** Selecting multiple images previews all of them; submit
reaches the Step 27 endpoint successfully.

**ONLY PROCEED WHEN:** verified.

**NEXT STEP:** Step 37 — Update-product frontend.

---

### Step 37 — Update-product frontend logic
```
COMMIT: dab6a97 — "feat: update chosen product frontend logic"
```
**PURPOSE:** Client-side JS for editing an existing product (pre-fill form,
submit to Step 28's endpoint).

**DEPENDENCIES:** Step 28, Step 36.

**VALIDATION:** Editing a product round-trips correctly (loads current
values, saves changes).

**ONLY PROCEED WHEN:** verified.

**DONE, WITH A DEVIATION NOTED (2026-08-31):** implemented as `books.ejs`'s
`.book-status-select` + `public/js/books.js` — logic (onchange → axios.post
to Step 28's `/admin/book/:id` → check `result.data`) matches burak's
`new-product-status` handler exactly, with one deliberate fix: burak blurs
*every* status-select on the page (`$(".new-product-status").blur()`), we
blur only the one just changed. **TODO, revisit later:** the colored
pill styling (green/amber/red per status) on the select is our own
addition — burak's own `products.css` has zero status-based styling
(plain unstyled `<select>`). Left as our own visual choice for now;
user asked to defer a final decision on it and move on.

**NEXT STEP:** Step 38 — Users page real-data fix.

---

### Step 38 — Fix: users page real data
```
COMMIT: ea35d4f — "fix: users page render real data"
```
**PURPOSE:** Same class of fix as Step 35, applied to the users page /
`getUsers` (Step 30).

**DEPENDENCIES:** Step 30, Step 32.

**VALIDATION:** Users page renders the real user list correctly.

**ONLY PROCEED WHEN:** verified.

**NEXT STEP:** Step 39 — Update-user frontend.

---

### Step 39 — Update-user frontend logic
```
COMMIT: 7293f86 — "fix: frontend chosen user update logic"
```
**PURPOSE:** Client-side JS for changing a user's status (block/unblock)
from the admin users page, calling Step 31's endpoint.

**DEPENDENCIES:** Step 31, Step 38.

**VALIDATION:** Blocking/unblocking from the UI round-trips and reflects
immediately.

**ONLY PROCEED WHEN:** verified.

**NEXT STEP:** Step 40 — SPA login fix.

---

### Step 40 — Fix: SPA login REST API process
```
COMMIT: 2948c82 — "fix: modify spa login rest api process"
```
**PURPOSE:** Bugfix on the SPA-side `MemberService.login` (Step 15),
likely surfaced once real frontend usage (Steps 33-39 built out the admin
side, prompting closer scrutiny of the parallel SPA path) exposed an edge
case.

**DEPENDENCIES:** Step 15.

**IMPLEMENTATION:** Correct error-branch/response shape in `login`; extend
`Message` enum if a new failure case was identified.

**VALIDATION:** Re-verify all Step 15 SPA login cases.

**ONLY PROCEED WHEN:** verified.

**NEXT STEP:** Step 41 — Admin JS refactor.

---

### Step 41 — Admin frontend JS refactor
```
COMMIT: 05bb10d — "fix: admin project refactoring"
```
**PURPOSE:** Cleanup pass across `home.js`, `products.js`, `signup.js`,
`users.js` — notably a large simplification of `signup.js` (111 lines
touched) accumulated across Steps 33-34.

**DEPENDENCIES:** Steps 33-39.

**ARCHITECTURE:** Establishes a project habit: **after a burst of feature
commits touching the same files, do a consolidation/refactor step** before
starting the next major feature area (here: JWT auth, Steps 42+). Preserve
this habit in the new project's workflow even if the specific files
differ.

**VALIDATION:** All admin pages still function identically after refactor
(regression check, not new behavior).

**ONLY PROCEED WHEN:** no behavior regressions found.

**NEXT STEP:** Step 42 — JWT token generation.

---

### Step 42 — JWT token generation
```
COMMIT: da50f04 — "feat: develop token via jwt"
```
**PURPOSE:** Begin the SPA's stateless-auth mechanism (the counterpart to
Step 18's session-based admin auth).

**DEPENDENCIES:** Step 9 (`Errors`), Step 2 (`SECRET_TOKEN` env var — add
it now if not already present).

**IMPLEMENTATION:** Add `jsonwebtoken`. `src/models/Auth.service.ts`:
`class AuthService { createToken(payload) }` — wraps `jwt.sign` in a
Promise, `expiresIn` driven by `AUTH_TIMER` (Step 9's config, hours →
`"${AUTH_TIMER}h"`), rejects with `Errors(UNAUTHORIZED,
TOKEN_CREATION_FAILED)` on signing failure.

**ARCHITECTURE:** **`AuthService` is a new, separate service** — not a
method on `MemberService` — because it's about *tokens*, not *members*;
`MemberService` and `AuthService` are composed together in the controller,
not merged. Keep this separation in the target project: authentication
mechanics vs. user-domain logic are different concerns.

**VALIDATION:** `createToken` produces a valid, correctly-expiring JWT for
a given payload.

**ONLY PROCEED WHEN:** verified with a JWT decoder that the payload and
expiry are correct.

**NEXT STEP:** Step 43 — Wire the token into signup/login as a cookie.

---

### Step 43 — SPA authentication via JWT + cookies
```
COMMIT: 753c03e — "feat: develop authentication via tokens with cookies"
```
**PURPOSE:** Actually issue the token on SPA signup/login and hand it to
the client.

**DEPENDENCIES:** Step 42, Step 15 (SPA signup/login to attach this to).

**IMPLEMENTATION:** `member.controller.signup`/`login`: after
`memberService.signup/login`, `authService.createToken(result)`, then
`res.cookie("accessToken", token, { maxAge: AUTH_TIMER * 3600 * 1000,
httpOnly: false })`, respond with `{ member, accessToken: token }` (token
sent both as a cookie AND in the JSON body — supports clients that read
either).

**ARCHITECTURE:** **`httpOnly: false` is a deliberate (if
security-debatable) choice** in the original — the SPA frontend reads the
cookie value directly via JS in some flows. Document this explicitly if
reproducing: a security-conscious target project should likely set
`httpOnly: true` and rely solely on the JSON body or an `Authorization`
header instead; note this as a known trade-off, don't silently "fix" it
without flagging it (per §0.6).

**VALIDATION:** Successful signup/login sets the `accessToken` cookie and
returns it in the JSON body; the JWT decodes to the correct member payload.

**ONLY PROCEED WHEN:** verified.

**NEXT STEP:** Step 44 — Verify/guard middleware.

---

### Step 44 — Verify authenticated user credentials
```
COMMIT: c8d5050 — "feat: develop verify authenticated user credentials"
```
**PURPOSE:** Build the middleware that protects SPA routes using the JWT
cookie from Step 43.

**DEPENDENCIES:** Step 43.

**IMPLEMENTATION:** `AuthService.checkAuth(token)`: `jwt.verify`, returns
the decoded member. `member.controller.verifyAuth`: reads
`req.cookies["accessToken"]`, sets `req.member` via `checkAuth`, throws
`Errors(UNAUTHORIZED, NOT_AUTHENTICATED)` if no valid member resolved,
else `next()`. Apply as route middleware on protected `router.ts` entries.

**ARCHITECTURE:** **Mandatory-auth middleware pattern**:
`router.get(path, memberController.verifyAuth, controller.handler)` — auth
check is a middleware, never inlined into the handler body. This is reused
for every protected SPA route from here on (member detail, update, orders).

**VALIDATION:** Request with a valid cookie reaches the handler with
`req.member` populated; request with no/invalid cookie is rejected with
401 before the handler runs.

**ONLY PROCEED WHEN:** verified both branches.

**NEXT STEP:** Step 45 — Optional-auth variant + logout.

---

### Step 45 — Middleware methods + SPA logout
```
COMMIT: f777770 — "feat: create middleware methods and develop logout process"
```
**PURPOSE:** Add the *optional*-auth counterpart to Step 44's *mandatory*
guard, plus SPA logout.

**DEPENDENCIES:** Step 44.

**IMPLEMENTATION:** `memberController.retrieveAuth`: same cookie-read/
`checkAuth` logic as `verifyAuth`, but calls `next()` unconditionally
(never throws) — used where auth is optional (e.g. product detail: logged-
in view-tracking vs anonymous browsing, see Step 51). `memberController
.logout`: clears the cookie (`res.cookie("accessToken", null, { maxAge: 0
})`).

**ARCHITECTURE:** **Two-tier auth-middleware convention**: `verifyAuth`
(hard gate, 401 on failure) vs `retrieveAuth` (soft/optional, populates
`req.member` if possible, never blocks). Apply the correct one per route
depending on whether the endpoint's behavior actually changes based on
identity (use `retrieveAuth`) or requires it (use `verifyAuth`).

**VALIDATION:** `retrieveAuth` never blocks a request even with a garbage
cookie; logout clears the cookie and subsequent `verifyAuth`-gated requests
are rejected.

**ONLY PROCEED WHEN:** both middlewares verified independently.

**NEXT STEP:** Step 46 — Member detail fix.

---

### Step 46 — Fix: getMemberDetail logic
```
COMMIT: 13ee1ec — "fix: modify get member detail logic"
```
**PURPOSE:** `GET /member/detail` (own profile) — bugfix pass.

**DEPENDENCIES:** Step 44.

**IMPLEMENTATION:** `MemberService.getMemberDetail(member)`: fetch by id +
`memberStatus: ACTIVE` filter (rejects if the calling member was
soft-deleted/blocked after their token was issued — a JWT alone doesn't
know about status changes after issuance, so this re-check matters).

**ARCHITECTURE:** **Important security/consistency pattern**: JWT payload
is a point-in-time snapshot; any endpoint that needs *current* authority
must re-verify status against the DB, not trust the token payload alone.
Apply this wherever a token-derived identity gates a sensitive action.

**VALIDATION:** A blocked member's still-valid JWT is correctly rejected at
this endpoint despite passing `verifyAuth`.

**ONLY PROCEED WHEN:** the blocked-member-with-valid-token case is
specifically tested.

**NEXT STEP:** Step 47 — Update own profile.

---

### Step 47 — updateMember business logic
```
COMMIT: 19ae888 — "feat: develop updateMember business logic"
```
**PURPOSE:** Let a logged-in SPA member update their own profile,
including replacing their image.

**DEPENDENCIES:** Step 24 (uploader), Step 44.

**IMPLEMENTATION:** Route: `verifyAuth` → `uploader("members")
.single("memberImage")` → `updateMember`. Controller: if `req.file`
present, set `input.memberImage = req.file.path` (normalize backslashes to
forward slashes for cross-platform URL correctness). Service: same
update-pattern as Step 28.

**ARCHITECTURE:** Confirms the uploader factory (Step 24) is reused
identically across member/product/product-update — no per-entity upload
config duplication.

**VALIDATION:** Update with and without a new image both work correctly;
existing image is preserved if none is provided.

**ONLY PROCEED WHEN:** verified.

**NEXT STEP:** Step 48 — Top users / leaderboard.

---

### Step 48 — getTopUsers REST API
```
COMMIT: 1885530 — "feat: develop getTopUsers rest API"
```
**PURPOSE:** Public leaderboard of top-point users (loyalty feature
surface — the points field has existed since Step 8 but nothing read it
until now).

**DEPENDENCIES:** Step 8 (`memberPoints` field).

**IMPLEMENTATION:** `MemberService.getTopUsers()`: `find({ memberStatus:
ACTIVE, memberPoints: { $gte: 1 } }).sort({ memberPoints: -1 }).limit(4)`.

**ARCHITECTURE:** No auth required (public endpoint) — confirms not every
SPA endpoint needs `verifyAuth`/`retrieveAuth`.

**VALIDATION:** Returns at most 4 members, correctly sorted, excluding
0-point and inactive members.

**ONLY PROCEED WHEN:** verified with a mixed dataset.

**NEXT STEP:** Step 49 — Get restaurant info.

---

### Step 49 — getRestaurant REST API
```
COMMIT: 4dc1f1c — "feat: create getRestaurant rest api"
```
**PURPOSE:** Public endpoint for the SPA to fetch the single
restaurant/business account's public info (name, address, image, etc. —
for an "about us" style display).

**DEPENDENCIES:** Step 8 (`MemberType.RESTAURANT`).

**IMPLEMENTATION:** `MemberService.getRestaurant()`: `findOne({
memberType: RESTAURANT })`.

**ARCHITECTURE:** Relies on the Step 12 business rule (exactly one
restaurant account) — this query would be ambiguous/wrong if that
invariant were ever violated. Flag this coupling explicitly if adapting to
a multi-tenant target project.

**VALIDATION:** Returns the single restaurant account's public data.

**ONLY PROCEED WHEN:** verified.

**NEXT STEP:** Step 50 — Product listing (public/SPA).

---

### Step 50 — getProducts API (SPA: pagination/search/filter)
```
COMMIT: 53b96fa — "feat: develop getProducts Api"
```
**PURPOSE:** The real, public-facing product listing endpoint — paginated,
searchable, filterable, sorted — as opposed to Step 29's unfiltered admin
listing.

**DEPENDENCIES:** Step 25 (schema).

**IMPLEMENTATION:** Query params → `ProductInquiry` (`page`, `limit`,
`order`, `productCollection?`, `search?`). Service: Mongo **aggregation
pipeline** — `$match` (always `productStatus: PROCESS`, plus optional
collection filter and a case-insensitive `$regex` name search), `$sort`
(price ascending is a special case — cheapest first — every other sort key
descending), `$skip`/`$limit` for pagination (`(page-1)*limit`).

**ARCHITECTURE:** **Aggregation pipeline, not `.find()`, for anything with
combined filter+sort+paginate** — this becomes the standard shape for
every "list with query params" endpoint (also Order's `getMyOrders`, Step
56). Public listing always hard-filters to `PROCESS` status — never trust
the client to only ask for visible products.

**VALIDATION:** Pagination math correct at boundaries; search is
case-insensitive substring match; price sort is ascending while all other
sorts are descending; only `PROCESS` products ever appear.

**ONLY PROCEED WHEN:** all of the above individually verified.

**NEXT STEP:** Step 51 — Product detail (SPA).

---

### Step 51 — getProduct REST API (detail + optional auth)
```
COMMIT: 7563316 — "feat: develop getProduct rest Api"
```
**PURPOSE:** Single-product detail endpoint, with optional
view-tracking if the requester happens to be logged in.

**DEPENDENCIES:** Step 45 (`retrieveAuth`), Step 25.

**IMPLEMENTATION:** Route uses `retrieveAuth` (not `verifyAuth` — anonymous
users can view products too). Controller passes `req.member?._id ?? null`
to the service. (The actual view-increment logic is stubbed here and
completed in Step 53, once the View domain exists — Step 52.)

**ARCHITECTURE:** Confirms `retrieveAuth`'s purpose from Step 45:
behavior (view-tracking) differs by identity, but identity is never
required.

**VALIDATION:** Works identically for anonymous and authenticated
requests, differing only in whether a view gets recorded (once Step 53
completes it).

**ONLY PROCEED WHEN:** basic detail-fetch (without view-tracking yet)
works for both anonymous and authenticated requests.

**NEXT STEP:** Step 52 — View domain model.

---

### Step 52 — View schema + service (view-tracking domain)
```
COMMIT: afd2cbf — "feat: create view schema and service models"
```
**PURPOSE:** New domain entity: a log of "member X viewed entity Y",
generalized via a `viewGroup` enum (currently only `PRODUCT`, but shaped to
extend to other viewable entity types later without a schema change).

**DEPENDENCIES:** Step 8 (Member ref).

**IMPLEMENTATION:** `src/libs/enums/view.enum.ts`: `ViewGroup` (`PRODUCT`).
`src/schema/View.model.ts`: `viewGroup`, `memberId` (ref Member),
`viewRefId` (generic ObjectId ref, not typed to a specific collection —
intentionally polymorphic). `src/models/View.service.ts`:
`checkViewExistence`, `insertMemberView`.

**ARCHITECTURE:** **Polymorphic-reference pattern**: `viewRefId` +
`viewGroup` together identify "what was viewed", instead of one FK field
per viewable entity type — the standard way to model "this log entity can
point at N different domain types" without N nullable FK columns.

**VALIDATION:** A view record can be created and its existence checked for
a given member+entity pair.

**ONLY PROCEED WHEN:** verified in isolation before wiring into Product
(Step 53).

**NEXT STEP:** Step 53 — Wire view-tracking into product detail.

---

### Step 53 — Fix: product view-increment logic
```
COMMIT: 7d7df1f — "fix: modiyf get product business logic"
```
**PURPOSE:** Complete Step 51's stub: increment `productViews` exactly
once per member, using the View log to deduplicate.

**DEPENDENCIES:** Steps 51, 52.

**IMPLEMENTATION:** In `ProductService.getProduct`: if a `memberId` is
present, `viewService.checkViewExistence(...)` — if no existing view,
`insertMemberView(...)` AND `findByIdAndUpdate(productId, { $inc: {
productViews: +1 } })`; if a view already exists, do neither.

**ARCHITECTURE:** **Dedup-before-increment pattern**: never `$inc` a
denormalized counter without first checking/recording the dedup key — this
exact shape (check existence → insert log → increment counter, all guarded
by the same "not already logged" branch) is the template for any future
"count unique X" feature.

**VALIDATION:** Same member viewing the same product twice increments
`productViews` only once; two different members viewing it increments it
twice; anonymous views never increment it (no `memberId` to dedupe on).

**ONLY PROCEED WHEN:** all three cases verified.

**NEXT STEP:** Step 54 — Order domain schemas.

---

### Step 54 — Order + OrderItem schema models
```
COMMIT: d19a06a — "feat: create order related schema models"
```
**PURPOSE:** Model the Order domain as two related collections: an Order
"header" (totals/status/owner) and OrderItem "lines" (product+qty+price
snapshot).

**DEPENDENCIES:** Steps 8 (Member ref), 25 (Product ref, referenced by id
from OrderItem).

**IMPLEMENTATION:** `src/libs/enums/order.enum.ts`: `OrderStatus`
(PAUSE/PROCESS/FINISH/DELETE). `src/schema/Order.model.ts`: `orderTotal`,
`orderDelivery`, `orderStatus` (default PAUSE), `memberId` (ref, required).
`src/schema/OrderItem.model.ts` (separate `orderItems` collection):
`itemQuantity`, `itemPrice` (price **snapshotted at order time**, not a
live reference to the product's current price), `orderId` (ref Order),
`productId` (ref Product).

**ARCHITECTURE:** **Order-header / order-line split into two
collections**, joined via `$lookup` at read time (Step 56) rather than
embedding line items as a subdocument array — chosen so line items can be
queried/joined against Product independently. **Price snapshotting**:
`itemPrice` is copied into the OrderItem at creation time so historical
orders remain accurate even if the product's price changes later — never
compute order totals from a live product price lookup.

**VALIDATION:** Schemas accept valid shapes and enforce required
refs/fields.

**ONLY PROCEED WHEN:** both schemas exist before any order-creation logic
is written.

**NEXT STEP:** Step 55 — Create order.

---

### Step 55 — createOrder REST API
```
COMMIT: 8c2da71 — "feat: create order rest api"
```
**PURPOSE:** Let an authenticated member place an order from a cart
(array of line items).

**DEPENDENCIES:** Steps 44 (auth), 54 (schemas).

**IMPLEMENTATION:** `src/libs/types/order.ts`: `OrderItemInput`,
`OrderInquiry`, `OrderUpdateInput`. `OrderService.createOrder(member,
items)`: sum `itemPrice * itemQuantity` across items →
**business rule: delivery fee = 5 if subtotal < 100, else 0** → create the
Order with `orderTotal = subtotal + delivery` → then
`recordOrderItem(orderId, items)` (maps each input item, sets `orderId` +
coerces `productId`, `Promise.all`-inserts all OrderItems).

**ARCHITECTURE:** **Order total is computed server-side from the item
list, never trusted from the client as a lump sum** — client sends
quantities/prices per line (itself should ideally be re-validated against
live product prices server-side; the original trusts client-supplied
`itemPrice`, which is a gap worth flagging, not silently fixing, if
reproducing for a payments-sensitive target — see §4). Order + its line
items are created as two sequential steps (header first to get an id, then
lines) rather than a transaction — acceptable here, but note as a
consistency trade-off for a target project with stricter guarantees.

**VALIDATION:** Order total and delivery fee are computed correctly at
both sides of the $100 threshold; all line items are persisted with the
correct `orderId`.

**ONLY PROCEED WHEN:** threshold boundary (exactly 100, 99.99, 100.01) is
specifically tested.

**NEXT STEP:** Step 56 — List own orders.

---

### Step 56 — getMyOrders REST API
```
COMMIT: 2f0fc1b — "feat: develop getMyOrders rest api"
```
**PURPOSE:** Member's own order history, paginated, filterable by status,
joined with line items and product data.

**DEPENDENCIES:** Step 55, Step 50 (aggregation-pipeline pattern to reuse).

**IMPLEMENTATION:** Aggregation: `$match` (own `memberId` + requested
`orderStatus`) → `$sort` (`updatedAt` desc) → `$skip`/`$limit` → `$lookup`
`orderItems` on `orderId` → `$lookup` `products` on
`orderItems.productId`.

**ARCHITECTURE:** Confirms the Step 50 aggregation-pagination shape is the
project standard, now combined with `$lookup` joins for the header+line+
product denormalization needed by the response.

**VALIDATION:** Returns only the requesting member's own orders, correctly
joined and paginated; a different member's orders never leak through.

**ONLY PROCEED WHEN:** ownership isolation is specifically verified (this
is a security-relevant check, not just a functional one).

**NEXT STEP:** Step 57 — Update order status.

---

### Step 57 — updateOrder REST API (+ loyalty points)
```
COMMIT: e89e1da — "feat: develop updateOrder rest Api"
```
**PURPOSE:** Change an order's status (e.g. mark received/finished), and
award loyalty points when an order transitions to `PROCESS`.

**DEPENDENCIES:** Steps 8 (`memberPoints`), 55.

**IMPLEMENTATION:** `OrderService.updateOrder(member, input)`:
`findOneAndUpdate({ memberId, _id: orderId }, { orderStatus })` (ownership
enforced in the query filter itself, not a separate check — matches Step
56's isolation approach). If the new status is `PROCESS`,
`memberService.addUserPoint(member, 1)`. `MemberService.addUserPoint`:
`$inc: { memberPoints: point }` scoped to `memberType: USER, memberStatus:
ACTIVE`.

**ARCHITECTURE:** **Ownership-in-query-filter pattern**, reused from Step
56: `findOneAndUpdate({ _id, memberId })` rather than fetch-then-check —
guarantees a member can never update another member's order, by
construction rather than by a fallible manual check. **Cross-domain side
effect on status transition** (Order status change → Member points
change) — kept inline in `OrderService` (which imports `MemberService`)
rather than an event/observer system; acceptable at this scale, call out
as a place to introduce an event bus if the target project's order-state
machine grows more transitions with more side effects.

**VALIDATION:** Status update only succeeds for the order's actual owner;
points increment exactly once per transition into `PROCESS` (verify it
does NOT re-award if the same order is updated to `PROCESS` again from an
already-`PROCESS` state, if that's reachable — flag if the original
doesn't guard this, see §4).

**ONLY PROCEED WHEN:** ownership isolation and the points side-effect are
both independently verified.

**NEXT STEP:** Step 58 — CORS.

---

### Step 58 — CORS integration
```
COMMIT: ffceb09 — "feat: CORS integration"
```
**PURPOSE:** Allow the SPA frontend (served from a different origin during
development, e.g. a separate React dev server) to call this API with
credentials (cookies).

**DEPENDENCIES:** Step 4.

**IMPLEMENTATION:** Add `cors` middleware in `app.ts`: `cors({ credentials:
true, origin: true })`.

**ARCHITECTURE:** `credentials: true` is required precisely because
Step 43's auth cookie must travel cross-origin — CORS config is not
independent of the auth mechanism chosen; a target project using
`Authorization` headers instead of cookies would not need
`credentials: true`. `origin: true` reflects the request's own origin
(permissive — appropriate for dev, reconsider for a production target).

**VALIDATION:** Cross-origin SPA requests succeed and the auth cookie is
sent/received correctly.

**ONLY PROCEED WHEN:** verified from an actual different-origin client, not
just Postman/same-origin testing.

**NEXT STEP:** Step 59 — Final stabilization pass.

---

### Step 59 — Final stabilization pass
```
COMMIT: 9159a4c — "feat: solve the problem"
```
**PURPOSE:** Closing bugfix commit — corrections in
`order.controller.ts`/`Order.service.ts` plus a `.gitignore` update.

**DEPENDENCIES:** Steps 54-57 (everything Order-related).

**IMPLEMENTATION:** Re-inspect the Order create/update/list flow end-to-end
and fix whatever the final round of manual testing surfaced (exact diff is
small — treat this as "run the full Order flow as a real user would and
fix what breaks," not as introducing new behavior).

**ARCHITECTURE:** No new architecture — this is the project's final
"harden the last domain built" pass, the same habit as Steps 14, 26, 40-41
applied one more time to Order specifically.

**VALIDATION:** Full order lifecycle (create → list → update status →
points awarded) works end-to-end without errors.

**ONLY PROCEED WHEN:** the full lifecycle test passes. This is the last
step — once it passes, the workflow is complete for this feature set.

**NEXT STEP:** None — sequence complete. Future work would start a new,
separately-analyzed sequence.

---

## §4. Cross-cutting architecture summary

- **Dual interface**: `/` = JSON REST API for an SPA, JWT-cookie auth
  (Steps 42-45). `/admin` = server-rendered EJS, session auth (Step 18).
  Same underlying services, two different controllers/routers per domain
  where both surfaces need it.
- **Layering**: `router → controller (object-literal) → service (class) →
  schema (Mongoose model)`. Controllers never touch Mongoose directly.
- **Centralized errors**: one `Errors` class + `HttpCode`/`Message` enums
  (Step 9), used identically in every controller's try/catch from Step 9
  onward.
- **Soft status enums** (`MemberStatus`, `ProductStatus`, `OrderStatus`)
  instead of hard deletes, on every domain entity.
- **Update-pattern**: `shapeIntoMongoseObjectId → findOneAndUpdate({new:
  true}) → throw NOT_MODIFIED if null`, identical across Member/Product/
  Order.
- **Ownership-in-query-filter**: any per-owner mutation/query includes the
  owner id directly in the Mongo filter, not as a separate check after
  fetching (Steps 56-57).
- **Aggregation pipeline** for any list endpoint needing
  filter+sort+paginate (Steps 50, 56), not `.find()`.
- **Dedup-before-increment** for denormalized counters (Step 53).
- **Price/amount snapshotting** at write time for historical accuracy
  (Step 54).
- **Uploader factory** parameterized by destination folder, uuid filenames
  (Step 24), reused for members and products.
- **Two independent auth mechanisms**, never sharing verification code:
  session+Mongo store for `/admin`, JWT+cookie for `/`.
- **Two-tier auth middleware**: `verifyAuth` (hard 401 gate) vs
  `retrieveAuth` (soft, never blocks) — pick per-route based on whether
  identity is required or merely optional.

### Eslatmalar ro'yxati (LightBooks-ga xos, keyinroq hal qilinadi)
- **Authors (mualliflar) katalogi** — `bstore-react`da to'liq `Author` turi bor
  (bio, janrlar, statistika, ijtimoiy havolalar), lekin burak'da (restoran
  loyihasi) hech qanday muqobili yo'q — o'zimiz loyihalashimiz kerak.
  2026-08-31: hozircha `bookAuthor` (oddiy matn maydoni) ham qo'shilmadi —
  butunlay keyinga qoldirildi, "Add New Book" formasi ham hozircha
  Author'siz quriladi.
- **Status-select rangi** (Step 37, `.book-status-select`) — yashil/sariq/
  qizil pill-uslubi bizning o'z dizaynimiz, burak'ning o'zida bunday rang
  yo'q (oddiy, bezaksiz select). Ranglarni qoldirish yoki burak'dagidek
  oddiy qilish haqida yakuniy qaror hali berilmagan.
- **Backend schema vs haqiqiy frontend (`bstore-react`) mos kelmasligi**
  (2026-08-31, `src/lib/types/product.ts` bilan solishtirib topildi):
  maydon nomlari (`bookName`→`title`, `bookPrice`→`price`,
  `bookLeftCount`→`stockCount`, `bookDesc`→`description`,
  `bookImages`→`images`, `bookGenre`(bitta)→`genres`(massiv)) va enum
  qiymatlari (`BookStatus`: bizda PAUSE/PROCESS/DELETE, frontend'da faqat
  ACTIVE/DELETE; `BookGenre`: bizda 5 ta, frontend'da 13 ta boshqa
  ro'yxat; `BookFormat`: frontend'da AUDIOBOOK ham bor) mos emas. Qaror:
  hozircha backend'ning soddalashtirilgan nomlarini **qoldiramiz**,
  Step 42-58'da (SPA/API qatlami) javobni frontend kutgan shaklga
  moslashtirib (map qilib) beramiz — hozir schema'ni qayta nomlashga
  vaqt sarflamaymiz.
- **Bitta kitob nomi (title) bir nechta formatda (eBook/Audiobook/
  Hardcover) sotilishi — alohida yozuv sifatidami yoki bitta yozuv
  ichida formatlar ro'yxati sifatidami?** — hali hal qilinmagan,
  keyinga qoldirildi (2026-08-31).
- **Order schema vs haqiqiy frontend mos kelmasligi** (2026-09-02,
  `src/lib/types/order.ts` bilan solishtirib topildi): frontend'da
  `paymentMethod` (COD/CARD/STRIPE/SKRILL/BITPAY) — bizda umuman yo'q;
  `shippingAddressId`, `subtotal`, `shippingFee`, `discount` — bizda
  faqat `orderTotal`+`orderDelivery` (burak'ning soddaroq modeli);
  `orderStatus`: frontend'da PENDING/PROCESSING/COMPLETED/CANCELLED/
  REFUNDED, bizda burak'dan olingan PAUSE/PROCESS/FINISH/DELETE —
  butunlay boshqacha; javobda frontend `orderItems[]` va
  `productData[]` (aggregate/birlashtirilgan) kutadi, biz hozircha
  faqat Order-boshini qaytaramiz; `productId`→bizda `bookId`. Qaror:
  Book domenidagi kabi — hozircha burak'ning soddalashtirilgan
  modelini qoldiramiz, moslashtirish (mapping) keyingi bosqichga.

### Known gaps / trade-offs in the original (flag, don't silently fix)
- `accessToken` cookie is `httpOnly: false` (Step 43) — XSS-exposed by
  design in the original; reconsider for a target project with different
  security requirements.
- `createOrder` (Step 55) trusts client-supplied `itemPrice` rather than
  re-pricing server-side from the current product record.
- Order header + line items are created as two sequential writes, not a
  transaction (Step 55).
- `models/` directory name is used for *services*, not Mongoose models
  (those live in `schema/`) — a naming inconsistency from Step 7 onward;
  fine to rename in a new project (e.g. `services/` + `schema/` or
  `services/` + `models/`), just be consistent.
- No automated tests exist anywhere in this history — `npm test` remains
  the placeholder from Step 1 through the final commit. If the target
  project wants test coverage, that is a deliberate addition on top of
  this workflow, not something to infer from it.

---

## §5. Adaptation rules for a different tech stack

1. Preserve the **order** and the **why** of each step above; translate
   concrete package/file names to the target stack's equivalents (e.g. a
   different ORM instead of Mongoose, a different session-store package,
   a different upload library).
2. If the target project already has an equivalent piece of
   architecture (its own router split, its own error-handling
   convention, etc.), **reuse it** rather than introducing a second,
   parallel convention just to match this document literally.
3. Framework-specific details (Express Router objects, EJS includes,
   Multer disk storage) are implementation detail. The
   architecture/business-rule content of each step (delivery-fee
   threshold, single-restaurant-account rule, dedup-before-increment,
   ownership-in-query-filter, etc.) is the part that must survive
   translation intact, since that is *product logic*, not framework
   plumbing.
4. If the target domain isn't a restaurant/food app, "Member/Product/
   Order/View" map to whatever the target's core entities are — but the
   *relationships and order in which they were introduced*
   (auth entity first, second entity + its schema, cross-cutting
   error/config standards, upload capability, then domain-specific
   business rules layered on top, then a second stateless-auth
   surface, then a dependent/joined entity like Order-on-Product) is the
   part to replicate.

---

## §6. How to use this file in another project

1. Read this entire file before writing any code.
2. Inspect the target project's current state.
3. Map Step 1's requirements onto the target project (adapt per §5).
4. Implement **only** Step 1.
5. Validate Step 1 per its own Validation criteria.
6. **STOP.** Report what was done and wait for explicit confirmation to
   continue.
7. On "continue" / "next step": read the next step, repeat 3-6 for it.
8. Never skip ahead, never combine steps, never implement a later step's
   functionality while working on an earlier one, even if it seems
   convenient.

---

## §7. Package versions — original (locked) vs. latest (recommended)

Captured 2026-08-11. Per the user's choice, the new project should install
**latest** versions, not the original's pinned ones — but several packages
jumped **major** versions since this workflow was written, which can break
the exact API shape a step describes. Re-verify each flagged step's
"Validation" against the new major version's docs/changelog before marking
that step done; don't assume the original's code sample is still
byte-for-byte correct.

| Package | Original (locked) | Latest | Used in | Notes |
|---|---|---|---|---|
| `express` | `4.17.3` | **`5.2.1`** | Step 4+ | ⚠️ Major. Express 5: `path-to-regexp` v8 (wildcard/optional route syntax changed, e.g. no more bare `*`), async errors in route handlers now auto-forward to error middleware, some removed methods (`res.send(status)`, `app.del`). Re-check every router file. |
| `mongoose` | `6.2.9` | **`9.9.2`** | Step 3+ | ⚠️ Major ×3. Mongoose 7 dropped callbacks, 8 changed several strict-mode/query defaults and dropped old Node, 9 continues that line. Re-check `Schema` option defaults, `.exec()` typing, and `connect()` options object (many old options are now no-ops/removed). |
| `ejs` | `3.1.6` | **`6.0.1`** | Step 16+ | ⚠️ Major. Re-check `include()` syntax and any renamed render options before trusting Step 16/17/32's EJS snippets verbatim. |
| `jsonwebtoken` | `8.5.1` | **`9.0.3`** | Step 42+ | ⚠️ Major. `jwt.sign`/`jwt.verify` now more strictly require an explicit `algorithm`/`algorithms` option in some configurations; re-verify `AuthService.createToken`/`checkAuth` against the current default-algorithm behavior. |
| `bcryptjs` | `2.4.3` | **`3.0.3`** | Step 12+ | Major, but API (`genSalt`/`hash`/`compare`) is stable; low risk. |
| `multer` | `1.4.5-lts.1` | **`2.2.0`** | Step 24+ | ⚠️ Major, security-motivated rewrite. Re-check error handling (`MulterError` shape) and default field/size limits in `uploader.ts` — don't assume 1.x defaults still apply. |
| `uuid` | `8.3.2` | **`14.0.1`** | Step 24+ | ⚠️ Major ×6, package is ESM-first now. `import { v4 } from "uuid"` still works, but confirm it resolves cleanly under this project's `NodeNext` module setting (Step 2) — this is exactly the kind of interaction §0.6 says to verify, not assume. |
| `dotenv` | `16.0.0` | **`17.4.2`** | Step 2 | Major, but `config()` API unchanged; low risk. |
| `connect-mongodb-session` | `3.1.1` | **`5.0.0`** | Step 18 | Major — re-check constructor options against current docs before trusting Step 18 verbatim. |
| `express-session` | `1.17.3` | `1.19.0` | Step 18 | Minor, low risk. |
| `cors` | `2.8.6` | `2.8.6` | Step 58 | Unchanged. |
| `cookie-parser` | `1.4.7` | `1.4.7` | Step 4+ | Unchanged. |
| `morgan` | `1.10.0` | `1.11.0` | Step 4 | Minor, low risk. |
| `typescript` | `5.2.2` | **`7.0.2`** | Step 1 | ⚠️ Major ×2. Re-verify `tsconfig.json` options from Steps 1-2 still mean the same thing (compiler defaults/strictness have tightened across 6→7). |
| `ts-node` | `10.9.1` | `10.9.2` | Step 1 | Patch, low risk. |
| `nodemon` | `3.0.2` | `3.1.14` | Step 1 | Minor, low risk. |
| `tsconfig-paths` | `4.2.0` | `4.2.0` | Step 1 | Unchanged (and removed again in Step 2 anyway, see Step 2's `baseUrl`/`paths` removal). |

**Do not carry these over into the new project** — they exist in the
original's `package.json` but are either unused by the real application or
purely artifacts of the excluded learning commits (§2):
- `moment` — added in Step 1 as a toolchain sanity-check import, never used
  anywhere in the actual app logic (Steps 2+ never import it again). If the
  new project needs date handling, use `dayjs` or the native `Intl`/`Date`
  APIs instead — `moment` has been in maintenance-mode/legacy status for
  years.
- `kill-port` — present in the original's `dependencies` but never
  `import`ed by any source file found in this repo; likely a manually-run
  CLI tool during development, not a runtime dependency.
- `tsx` — added by the excluded `5aa1f46` commit solely to run
  `train.ts` (personal practice), not used by `server.ts`/`app.ts`.
- `mongodb` (the driver, as a *direct* dependency) — `mongoose` already
  depends on it; the original's explicit direct dependency on it is
  redundant, don't add it separately in the new project.

**Type packages**: pair every runtime package above with its matching
`@types/*` devDependency at its own latest version (`@types/express`,
`@types/cors`, `@types/cookie-parser`, `@types/morgan`, `@types/multer`,
`@types/jsonwebtoken`, `@types/bcryptjs`, `@types/express-session`,
`@types/node`) — all were already latest-aligned or one minor behind as of
this capture, so no separate breaking-change risk beyond what's already
flagged above for their runtime counterparts.
