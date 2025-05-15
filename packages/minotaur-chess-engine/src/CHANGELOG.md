# [1.12.0](https://github.com/karmacarrot/minotaur/compare/v1.11.0...v1.12.0) (2025-05-15)


### Features

* uci conversion wip ([fb113a9](https://github.com/karmacarrot/minotaur/commit/fb113a9976d9c06ca073d3e6142f90c76a8449fc))

# [1.11.0](https://github.com/karmacarrot/minotaur/compare/v1.10.0...v1.11.0) (2025-05-15)


### Features

* added FEN functions to output FEN strings based on board and game state ([640a29d](https://github.com/karmacarrot/minotaur/commit/640a29d976c83ae9955abc24ce63efd33438cdd6))

# [1.10.0](https://github.com/karmacarrot/minotaur/compare/v1.9.0...v1.10.0) (2024-12-29)


### Features

* en passant captures implemented for computer moves ([f683715](https://github.com/karmacarrot/minotaur/commit/f6837153c8328252109bc72b54e6d76876aeb722))

# [1.9.0](https://github.com/karmacarrot/minotaur/compare/v1.8.0...v1.9.0) (2024-12-27)


### Features

* en passant implemented for human player with functions for converting from board positions to co-ordinates and vice versa ([482e73c](https://github.com/karmacarrot/minotaur/commit/482e73c0ac64cf4612e11af2c807736a4d5c822e))

# [1.8.0](https://github.com/karmacarrot/minotaur/compare/v1.7.0...v1.8.0) (2024-12-04)


### Features

* allowing referee to understand en passant and refactoring useMinotaur to centralise game status management via useReducer ([340b3e5](https://github.com/karmacarrot/minotaur/commit/340b3e5486e0645947fcb2a658bc060a345426ce))

# [1.7.0](https://github.com/karmacarrot/minotaur/compare/v1.6.0...v1.7.0) (2024-12-04)


### Features

* en passant function added with tests but not yet used by game ([697c72b](https://github.com/karmacarrot/minotaur/commit/697c72b2d94b85c2fc221e17b86c674c849f303f))

# [1.6.0](https://github.com/karmacarrot/minotaur/compare/v1.5.1...v1.6.0) (2024-11-17)


### Features

* finishing castling rules to not allow castling through or out of check ([42074ff](https://github.com/karmacarrot/minotaur/commit/42074ff847f0da916d2c31a565e098a172acdc14))

## [1.5.1](https://github.com/karmacarrot/minotaur/compare/v1.5.0...v1.5.1) (2024-11-14)


### Bug Fixes

* resolving piece imagery and styling in storybook ([978a8dc](https://github.com/karmacarrot/minotaur/commit/978a8dc686ba3d3990116b52ce8e016e613c3cd7))

# [1.5.0](https://github.com/karmacarrot/minotaur/compare/v1.4.5...v1.5.0) (2024-11-13)


### Features

* adding storybook ([e50e30e](https://github.com/karmacarrot/minotaur/commit/e50e30e9fec26b8e6d594b5d856fc36afd874965))

## [1.4.5](https://github.com/karmacarrot/minotaur/compare/v1.4.4...v1.4.5) (2024-11-10)


### Bug Fixes

* working through some failing tests and adding extra coverage in order to add checks against castling through check ([a6062ac](https://github.com/karmacarrot/minotaur/commit/a6062aca1a30638c57abee9ae92b8d2a414fad15))

## [1.4.4](https://github.com/karmacarrot/minotaur/compare/v1.4.3...v1.4.4) (2024-10-27)


### Bug Fixes

* fixing castling test ([dbde592](https://github.com/karmacarrot/minotaur/commit/dbde5929fc2ebfcf42b4e6570d78f6c4f3e8e75f))

## [1.4.3](https://github.com/karmacarrot/minotaur/compare/v1.4.2...v1.4.3) (2024-10-27)


### Bug Fixes

* missing dependencies resolved for failing react tests after moving to monorepo ([e131d1e](https://github.com/karmacarrot/minotaur/commit/e131d1e379d880b5fdf9aac610a009dd01076304))

## [1.4.2](https://github.com/karmacarrot/minotaur/compare/v1.4.1...v1.4.2) (2024-10-20)


### Bug Fixes

* fixing more test references after project restructure ([5e425b0](https://github.com/karmacarrot/minotaur/commit/5e425b03e1d2ca575a3031c38f612400dbc9e47d))

## [1.4.1](https://github.com/karmacarrot/minotaur/compare/v1.4.0...v1.4.1) (2024-10-20)


### Bug Fixes

* fixing non running tests ([e506523](https://github.com/karmacarrot/minotaur/commit/e5065239558747669185490725a92fdc4783deec))

# [1.4.0](https://github.com/karmacarrot/minotaur/compare/v1.3.1...v1.4.0) (2024-09-29)


### Features

* adding touch events ([740485c](https://github.com/karmacarrot/minotaur/commit/740485c30c4671be8ce708d2eaf92932ed18e42c))

## [1.3.1](https://github.com/karmacarrot/minotaur/compare/v1.3.0...v1.3.1) (2024-09-29)


### Bug Fixes

* refactored react components to use styled components instead of partials ([d7147b7](https://github.com/karmacarrot/minotaur/commit/d7147b7cfc33aa66351ebab3d59ab6ac2dfe31d6))

# [1.3.0](https://github.com/karmacarrot/minotaur/compare/v1.2.1...v1.3.0) (2024-09-22)


### Features

* adding images, config for consuming apps, various refactoring ([04b31a8](https://github.com/karmacarrot/minotaur/commit/04b31a888ebce275a61bd3542fc9c9ad7f16b193))

## [1.2.1](https://github.com/karmacarrot/minotaur/compare/v1.2.0...v1.2.1) (2024-09-17)


### Bug Fixes

* re-exporting components ([d4c8c4d](https://github.com/karmacarrot/minotaur/commit/d4c8c4dacc911a3d206aff029d9680b64db91a2b))

# [1.2.0](https://github.com/karmacarrot/minotaur/compare/v1.1.0...v1.2.0) (2024-09-17)


### Features

* adding components to minotaur react package ([720d075](https://github.com/karmacarrot/minotaur/commit/720d07550f80f2626dc04033f7e3e1e6bdf1e8ed))

# [1.1.0](https://github.com/karmacarrot/minotaur/compare/v1.0.0...v1.1.0) (2024-09-17)


### Features

* testing semantic with a feature commit ([c891159](https://github.com/karmacarrot/minotaur/commit/c891159f52bad40a8cd92ca88c0853296a69bb71))

# 1.0.0 (2024-09-17)


### Bug Fixes

* missing path when publishing ([49f0ed1](https://github.com/karmacarrot/minotaur/commit/49f0ed10d43a168e2ee821a9ae2c78941148ca0a))
* removing reference to process for build pipeline ([0db0f67](https://github.com/karmacarrot/minotaur/commit/0db0f67da57ec663ae06c1cf7c014d39a15745b4))


### Features

* initial checkin of latest chess engine transferred from ridingthebomb repo ([c1aca16](https://github.com/karmacarrot/minotaur/commit/c1aca16b991d774298f74a4d1e6bda724e2afce2))
