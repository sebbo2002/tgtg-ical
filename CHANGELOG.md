# [1.0.0-develop.9](https://github.com/sebbo2002/tgtg-ical/compare/v1.0.0-develop.8...v1.0.0-develop.9) (2023-10-02)

# [1.0.0-develop.8](https://github.com/sebbo2002/tgtg-ical/compare/v1.0.0-develop.7...v1.0.0-develop.8) (2023-09-27)

# [1.0.0-develop.7](https://github.com/sebbo2002/tgtg-ical/compare/v1.0.0-develop.6...v1.0.0-develop.7) (2023-09-25)

# [1.0.0-develop.6](https://github.com/sebbo2002/tgtg-ical/compare/v1.0.0-develop.5...v1.0.0-develop.6) (2023-08-23)


### Reverts

* Revert "ci: Downgrade is-semantic-release till it's fixed" ([91c2ab5](https://github.com/sebbo2002/tgtg-ical/commit/91c2ab59d0559a060c11d07973382c465dd3345d))

# [1.0.0-develop.5](https://github.com/sebbo2002/tgtg-ical/compare/v1.0.0-develop.4...v1.0.0-develop.5) (2023-08-16)


### Bug Fixes

* Fix cleanup typo + 3h min age ([0320248](https://github.com/sebbo2002/tgtg-ical/commit/03202488ac88e96dc6417ab7ba3a53b4642b058e))

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
