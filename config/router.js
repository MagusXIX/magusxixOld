/*
 * Geddy JavaScript Web development framework
 * Copyright 2112 Matthew Eernisse (mde@fleegix.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
*/


var router = new geddy.RegExpRouter();

router.get('/').to('Main.index');
router.get('/projects').to('Main.projects');
router.get('/playground').to('Main.playground');
router.get('/sectormap').to('Main.sectorMap');
router.get('/chat').to('Main.chat');
router.get('/chat_sign_up').to('Main.chatSignUp');
router.get('/sign_up_attempt').to('Main.signUpAttempt');

router.get('/bundle.js').to('Main.bundle');
router.get('/chatBundle.js').to('Main.chatBundle');

router.get('/sector/generate').to('Api.generateSector');
router.get('/sector/load/:x/:y').to('Api.loadSector');
router.get('/system/load/:id').to('Api.loadSystem');
router.get('/star/load/:id').to('Api.loadStar');
router.get('/planet/load/:id').to('Api.loadPlanet');

// Basic routes
// router.match('/moving/pictures/:id', 'GET').to('Moving.pictures');
//
// router.match('/farewells/:farewelltype/kings/:kingid', 'GET').to('Farewells.kings');
//
// Can also match specific HTTP methods only
// router.get('/xandadu').to('Xanadu.specialHandler');
// router.del('/xandadu/:id').to('Xanadu.killItWithFire');
//
// Resource-based routes
// router.resource('hemispheres');
//
// Nested Resource-based routes
// router.resource('hemispheres', function(){
//   this.resource('countries');
//   this.get('/print(.:format)').to('Hemispheres.print');
// });

exports.router = router;
