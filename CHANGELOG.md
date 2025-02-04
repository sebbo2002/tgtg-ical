## [2.0.6](https://github.com/sebbo2002/tgtg-ical/compare/v2.0.5...v2.0.6) (2025-02-04)


### Bug Fixes

* Fix order parser to work with current emails ([d54059b](https://github.com/sebbo2002/tgtg-ical/commit/d54059bc45ec03a7bdf6717c73d3d8e87a0e6e8d))

## [2.0.5](https://github.com/sebbo2002/tgtg-ical/compare/v2.0.4...v2.0.5) (2025-01-09)

## [2.0.4](https://github.com/sebbo2002/tgtg-ical/compare/v2.0.3...v2.0.4) (2024-12-05)


### Bug Fixes

* **deps:** downgrade eslint to v9.13.0 to resolve typescript-eslint issue ([ad20987](https://github.com/sebbo2002/tgtg-ical/commit/ad20987733dd5b87689c181aeb60cc5c65acd4ac)), closes [#10353](https://github.com/sebbo2002/tgtg-ical/issues/10353) [typescript-eslint/typescript-eslint#10353](https://github.com/typescript-eslint/typescript-eslint/issues/10353)

## [2.0.3](https://github.com/sebbo2002/tgtg-ical/compare/v2.0.2...v2.0.3) (2024-11-15)

## [2.0.2](https://github.com/sebbo2002/tgtg-ical/compare/v2.0.1...v2.0.2) (2024-10-24)


### Bug Fixes

* Add support for new order emails ([02c2ca5](https://github.com/sebbo2002/tgtg-ical/commit/02c2ca5154cd2da023f4577f3d8093cbae1683ee))

## [2.0.1](https://github.com/sebbo2002/tgtg-ical/compare/v2.0.0...v2.0.1) (2024-10-10)

# [2.0.0](https://github.com/sebbo2002/tgtg-ical/compare/v1.2.0...v2.0.0) (2024-08-26)


### chore

* Drop support for node.js v19 and v21 ([2fff079](https://github.com/sebbo2002/tgtg-ical/commit/2fff079040a377fbe9ecc340388f6a29b863cf80))


### BREAKING CHANGES

* Drop node.js v21 Support

These node.js versions are no longer supported. For more information see https://nodejs.dev/en/about/releases/

# [1.2.0](https://github.com/sebbo2002/tgtg-ical/compare/v1.1.6...v1.2.0) (2024-08-04)


### Features

* Replace Matomo tracking code with the Umami code ([0f9feb3](https://github.com/sebbo2002/tgtg-ical/commit/0f9feb324d4484371ced0982eab7da0ab1cbe601))

## [1.1.6](https://github.com/sebbo2002/tgtg-ical/compare/v1.1.5...v1.1.6) (2024-06-13)

## [1.1.5](https://github.com/sebbo2002/tgtg-ical/compare/v1.1.4...v1.1.5) (2024-05-03)


### Bug Fixes

* Correct year in order emails ([9ef1f04](https://github.com/sebbo2002/tgtg-ical/commit/9ef1f048b66690b2d89d7e8a6eeeba637b5e5489))

## [1.1.4](https://github.com/sebbo2002/tgtg-ical/compare/v1.1.3...v1.1.4) (2024-04-15)

## [1.1.3](https://github.com/sebbo2002/tgtg-ical/compare/v1.1.2...v1.1.3) (2024-03-26)

## [1.1.2](https://github.com/sebbo2002/tgtg-ical/compare/v1.1.1...v1.1.2) (2024-03-07)

## [1.1.1](https://github.com/sebbo2002/tgtg-ical/compare/v1.1.0...v1.1.1) (2024-02-21)

# [1.1.0](https://github.com/sebbo2002/tgtg-ical/compare/v1.0.2...v1.1.0) (2024-01-10)


### Bug Fixes

* **Config:** Get tgtg-ical version from package.json directly ([e3fa8d7](https://github.com/sebbo2002/tgtg-ical/commit/e3fa8d73e3bbca396e093adccad3ed1c5b904606))
* Fix test in health endpoint ([05f650a](https://github.com/sebbo2002/tgtg-ical/commit/05f650ab6c48c3ec978a6fb70305e6ca6a15cdf5))
* **Parser:** Also recheck if version is not set ([e007d5e](https://github.com/sebbo2002/tgtg-ical/commit/e007d5e7d00b3078bbe8bdd79939b34d67ae637b))
* **Parser:** time-changed parsing ([add3622](https://github.com/sebbo2002/tgtg-ical/commit/add3622cd144717a0437adb257fd4c2f334ca6bd))


### Features

* Run cleanup once after server start ([de3ae77](https://github.com/sebbo2002/tgtg-ical/commit/de3ae7790be3e39daf6a6930b79aa4a00907e506))

## [1.0.2](https://github.com/sebbo2002/tgtg-ical/compare/v1.0.1...v1.0.2) (2023-11-23)


### Bug Fixes

* **Parser:** decode html in name / address ([7b3f5b0](https://github.com/sebbo2002/tgtg-ical/commit/7b3f5b03a78097177ca12ae6c38fd5a371ea7fc7))

## [1.0.1](https://github.com/sebbo2002/tgtg-ical/compare/v1.0.0...v1.0.1) (2023-10-25)


### Bug Fixes

* Fix cleanup typo + 3h min age ([0320248](https://github.com/sebbo2002/tgtg-ical/commit/03202488ac88e96dc6417ab7ba3a53b4642b058e))


### Reverts

* Revert "ci: Run tests with node.js v18, v20 and v21" ([405853b](https://github.com/sebbo2002/tgtg-ical/commit/405853bbd7fc55eb224ff657af7dab26f9482d88))
* Revert "ci: Downgrade is-semantic-release till it's fixed" ([91c2ab5](https://github.com/sebbo2002/tgtg-ical/commit/91c2ab59d0559a060c11d07973382c465dd3345d))

# 1.0.0 (2023-08-16)


### Bug Fixes

* **CI:** Fix DockerHub container release ([01b7534](https://github.com/sebbo2002/tgtg-ical/commit/01b753406d1f1ef24a949c7d7b946d99b779d013))
* Fix typo in /_health ([68f73da](https://github.com/sebbo2002/tgtg-ical/commit/68f73da2b120b802343e6afa20b4958ef3ac0712))


### Build System

* Deprecate node.js 12 ([426588b](https://github.com/sebbo2002/tgtg-ical/commit/426588b4bb7bde2924bbc92006ca839e960872e1))
* Deprecate node.js v14 / v17 ([7a2de45](https://github.com/sebbo2002/tgtg-ical/commit/7a2de45c12f19a1ec441b3a004f4aa935efc197c))
* Native ESM support ([7b86a4f](https://github.com/sebbo2002/tgtg-ical/commit/7b86a4f1187c387a3a5792e1fb72d822b04e3631))


### chore

* Remove node.js 10 Support ([2b910c0](https://github.com/sebbo2002/tgtg-ical/commit/2b910c09bc8a41085fc4472159494d8738d5521e))


### Features

* Add `npm run deploy` script to deploy directly ([fe1948d](https://github.com/sebbo2002/tgtg-ical/commit/fe1948d624dfe9bddf1f8a2e3fddfb5741aa2832))
* first commit 🎉 ([1cd16d9](https://github.com/sebbo2002/tgtg-ical/commit/1cd16d931eded944685ac4293b80415c495b0b0a))


### Reverts

* Revert "ci: Remove docker setup" ([655068b](https://github.com/sebbo2002/tgtg-ical/commit/655068b3b9c6139181ae87421db5f8144fae3e18))


### BREAKING CHANGES

* The node.js versions v14 and v17 are no longer maintained and are therefore no longer supported. See https://nodejs.dev/en/about/releases/ for more details on node.js release cycles.
* From now on, only node.js ^14.8.0 || >=16.0.0 are supported
* Only Support for node.js ^12.20.0 || >=14.13.1
* Removed support for node.js v10

# [1.0.0-develop.4](https://github.com/sebbo2002/tgtg-ical/compare/v1.0.0-develop.3...v1.0.0-develop.4) (2023-08-16)

# [1.0.0-develop.3](https://github.com/sebbo2002/tgtg-ical/compare/v1.0.0-develop.2...v1.0.0-develop.3) (2023-08-16)


### Bug Fixes

* Fix typo in /_health ([68f73da](https://github.com/sebbo2002/tgtg-ical/commit/68f73da2b120b802343e6afa20b4958ef3ac0712))

# [1.0.0-develop.2](https://github.com/sebbo2002/tgtg-ical/compare/v1.0.0-develop.1...v1.0.0-develop.2) (2023-08-16)


### Features

* Add `npm run deploy` script to deploy directly ([fe1948d](https://github.com/sebbo2002/tgtg-ical/commit/fe1948d624dfe9bddf1f8a2e3fddfb5741aa2832))

# 1.0.0-develop.1 (2023-08-16)


### Bug Fixes

* **CI:** Fix DockerHub container release ([01b7534](https://github.com/sebbo2002/tgtg-ical/commit/01b753406d1f1ef24a949c7d7b946d99b779d013))


### Build System

* Deprecate node.js 12 ([426588b](https://github.com/sebbo2002/tgtg-ical/commit/426588b4bb7bde2924bbc92006ca839e960872e1))
* Deprecate node.js v14 / v17 ([7a2de45](https://github.com/sebbo2002/tgtg-ical/commit/7a2de45c12f19a1ec441b3a004f4aa935efc197c))
* Native ESM support ([7b86a4f](https://github.com/sebbo2002/tgtg-ical/commit/7b86a4f1187c387a3a5792e1fb72d822b04e3631))


### chore

* Remove node.js 10 Support ([2b910c0](https://github.com/sebbo2002/tgtg-ical/commit/2b910c09bc8a41085fc4472159494d8738d5521e))


### Features

* first commit 🎉 ([1cd16d9](https://github.com/sebbo2002/tgtg-ical/commit/1cd16d931eded944685ac4293b80415c495b0b0a))


### Reverts

* Revert "ci: Remove docker setup" ([655068b](https://github.com/sebbo2002/tgtg-ical/commit/655068b3b9c6139181ae87421db5f8144fae3e18))


### BREAKING CHANGES

* The node.js versions v14 and v17 are no longer maintained and are therefore no longer supported. See https://nodejs.dev/en/about/releases/ for more details on node.js release cycles.
* From now on, only node.js ^14.8.0 || >=16.0.0 are supported
* Only Support for node.js ^12.20.0 || >=14.13.1
* Removed support for node.js v10
