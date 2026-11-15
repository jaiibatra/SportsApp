/*
 * triage.js
 * Injury data and matching logic for Sideline. There is no React in this file,
 * so the same code runs in the browser (SidelineApp.jsx) and in Node
 * (run-accuracy.mjs).
 *
 * BASE_DB comes from the team's INJURY_GENERAL / INJURY_SEVERITY / MOVE /
 * MOVE_INJURY tables. Everything marked PROVISIONAL below was added after
 * tester feedback and has NOT been reviewed by a clinician.
 */

const BASE_DB = {"injuries":[{"injury_id":1,"injury_name":"Ankle Sprain","injury_sport":"Basketball","body_part":"Ankle","pain_location":"Around the ankle joint, most often lateral (outside)","swelling":"Yes","bruising":"Yes","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Sometimes"},{"injury_id":2,"injury_name":"ACL Tear","injury_sport":"Basketball","body_part":"Knee","pain_location":"Deep in the knee, sometimes diffuse","swelling":"Yes","bruising":"No","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Yes"},{"injury_id":3,"injury_name":"Meniscus Tear","injury_sport":"Basketball","body_part":"Knee","pain_location":"Joint line of the knee (inner or outer)","swelling":"Yes","bruising":"No","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Sometimes"},{"injury_id":4,"injury_name":"Patellar Tendinitis - Jumper's Knee","injury_sport":"Basketball","body_part":"Knee","pain_location":"Just below the kneecap, at the patellar tendon","swelling":"No","bruising":"No","instability":"No","limited_range_of_motion":"Yes","audible_pop":"No"},{"injury_id":5,"injury_name":"Achilles Tendon Rupture","injury_sport":"Basketball","body_part":"Lower Calf","pain_location":"Back of the ankle/lower calf","swelling":"Yes","bruising":"Yes","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Yes"},{"injury_id":6,"injury_name":"Finger Sprain","injury_sport":"Basketball","body_part":"Finger Joint","pain_location":"Localized to the affected finger joint","swelling":"Yes","bruising":"Yes","instability":"No","limited_range_of_motion":"Yes","audible_pop":"No"},{"injury_id":7,"injury_name":"Finger Fracture","injury_sport":"Basketball","body_part":"Finger Joint","pain_location":"Localized to the affected finger joint","swelling":"Yes","bruising":"Yes","instability":"Sometimes","limited_range_of_motion":"Yes","audible_pop":"No"},{"injury_id":8,"injury_name":"Hamstring Strain","injury_sport":"Basketball","body_part":"Hamstring","pain_location":"Back of the thigh, sudden and sharp mid-sprint","swelling":"Sometimes","bruising":"Yes","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Sometimes"},{"injury_id":9,"injury_name":"Lower Back Strain","injury_sport":"Basketball","body_part":"Lower Back","pain_location":"Lower b ack, sometimes radiating to hip","swelling":"No","bruising":"No","instability":"No","limited_range_of_motion":"Yes","audible_pop":"No"},{"injury_id":10,"injury_name":"Concussion","injury_sport":"Basketball","body_part":"Head","pain_location":"Head/neck, may include headache","swelling":"Sometimes","bruising":"Sometimes","instability":"Yes","limited_range_of_motion":"No","audible_pop":"No"},{"injury_id":11,"injury_name":"Wrist Sprain","injury_sport":"Basketball","body_part":"Wrist","pain_location":"Localized to the wrist, sometimes radiating into the hand","swelling":"Yes","bruising":"Yes","instability":"No","limited_range_of_motion":"Yes","audible_pop":"No"},{"injury_id":12,"injury_name":"Wrist Fracture","injury_sport":"Basketball","body_part":"Wrist","pain_location":"Localized to the wrist, sometimes radiating into the hand","swelling":"Yes","bruising":"Yes","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"No"},{"injury_id":13,"injury_name":"Rotator Cuff Strain","injury_sport":"Baseball","body_part":"Shoulder","pain_location":"Front/side of shoulder, may radiate down arm","swelling":"No","bruising":"No","instability":"No","limited_range_of_motion":"Yes","audible_pop":"No"},{"injury_id":14,"injury_name":"Rotator Cuff Tear","injury_sport":"Baseball","body_part":"Shoulder","pain_location":"Front/side of shoulder, may radiate down arm","swelling":"No","bruising":"Sometimes","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"No"},{"injury_id":15,"injury_name":"UCL Sprain","injury_sport":"Baseball","body_part":"Elbow","pain_location":"Inner (medial) elbow","swelling":"No","bruising":"No","instability":"Yes","limited_range_of_motion":"No","audible_pop":"No"},{"injury_id":16,"injury_name":"UCL Tear","injury_sport":"Baseball","body_part":"Elbow","pain_location":"Inner (medial) elbow","swelling":"No","bruising":"Sometimes","instability":"Yes","limited_range_of_motion":"No","audible_pop":"Yes"},{"injury_id":17,"injury_name":"Labral Tear - Shoulder","injury_sport":"Baseball","body_part":"Shoulder","pain_location":"Deep in shoulder joint, catching sensation","swelling":"No","bruising":"No","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Sometimes"},{"injury_id":18,"injury_name":"Oblique Strain","injury_sport":"Baseball","body_part":"Torso","pain_location":"Side of torso/ribcage, sharp and localized","swelling":"No","bruising":"Sometimes","instability":"No","limited_range_of_motion":"Yes","audible_pop":"No"},{"injury_id":19,"injury_name":"Hamstring Strain","injury_sport":"Baseball","body_part":"Hamstring","pain_location":"Back of thigh, sudden/sharp mid-sprint","swelling":"Sometimes","bruising":"Yes","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Sometimes"},{"injury_id":20,"injury_name":"Ankle Sprain","injury_sport":"Baseball","body_part":"Ankle","pain_location":"Around ankle joint, lateral side most common","swelling":"Yes","bruising":"Yes","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Sometimes"},{"injury_id":21,"injury_name":"Concussion","injury_sport":"Baseball","body_part":"Head","pain_location":"Head/neck, possible headache","swelling":"Sometimes","bruising":"Sometimes","instability":"Yes","limited_range_of_motion":"No","audible_pop":"No"},{"injury_id":22,"injury_name":"Hand Contusion","injury_sport":"Baseball","body_part":"Hand","pain_location":"Localized to impact point","swelling":"Yes","bruising":"Yes","instability":"No","limited_range_of_motion":"Yes","audible_pop":"No"},{"injury_id":23,"injury_name":"Wrist Fracture","injury_sport":"Baseball","body_part":"Wrist","pain_location":"Localized to impact point","swelling":"Yes","bruising":"Yes","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"No"},{"injury_id":24,"injury_name":"Knee Injury - Meniscus","injury_sport":"Baseball","body_part":"Knee","pain_location":"Around/behind kneecap, or joint line","swelling":"Yes","bruising":"No","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Sometimes"},{"injury_id":25,"injury_name":"Knee Injury - Patellar","injury_sport":"Baseball","body_part":"Knee","pain_location":"Around/behind kneecap, or joint line","swelling":"Yes","bruising":"No","instability":"No","limited_range_of_motion":"Yes","audible_pop":"No"},{"injury_id":26,"injury_name":"Lower Back Strain / Spondylolysis","injury_sport":"Baseball","body_part":"Lower Back","pain_location":"Lower back, may radiate to hip/buttock","swelling":"No","bruising":"No","instability":"No","limited_range_of_motion":"Yes","audible_pop":"No"},{"injury_id":27,"injury_name":"ACL Tear","injury_sport":"Football","body_part":"Knee","pain_location":"Deep in the knee joint","swelling":"Yes","bruising":"No","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Yes"},{"injury_id":28,"injury_name":"Concussion","injury_sport":"Football","body_part":"Head","pain_location":"Generalized headache or pressure in the head","swelling":"No","bruising":"No","instability":"Yes","limited_range_of_motion":"No","audible_pop":"No"},{"injury_id":29,"injury_name":"Ankle Sprain","injury_sport":"Football","body_part":"Ankle","pain_location":"Above the ankle joint, between the tibia and fibula","swelling":"Yes","bruising":"Yes","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Sometimes"},{"injury_id":30,"injury_name":"Hamstring Strain","injury_sport":"Football","body_part":"Hamstring","pain_location":"Back of the thigh","swelling":"Sometimes","bruising":"Yes","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Sometimes"},{"injury_id":31,"injury_name":"MCL Sprain","injury_sport":"Football","body_part":"Knee","pain_location":"Inner side of knee","swelling":"Yes","bruising":"Sometimes","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Sometimes"},{"injury_id":32,"injury_name":"Shoulder Dislocation","injury_sport":"Football","body_part":"Shoulder","pain_location":"Outer shoulder/deltoid area","swelling":"Yes","bruising":"No","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Yes"},{"injury_id":33,"injury_name":"Turf Toe","injury_sport":"Football","body_part":"Big Toe","pain_location":"Base of big toe","swelling":"Yes","bruising":"Sometimes","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Sometimes"},{"injury_id":34,"injury_name":"Achilles Tear","injury_sport":"Football","body_part":"Achilles Tendon","pain_location":"Back of ankle/heel","swelling":"Yes","bruising":"Yes","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Yes"},{"injury_id":35,"injury_name":"Rib Fracture","injury_sport":"Football","body_part":"Chest","pain_location":"Side or front of chest","swelling":"Sometimes","bruising":"Sometimes","instability":"No","limited_range_of_motion":"Yes","audible_pop":"Sometimes"},{"injury_id":36,"injury_name":"Meniscus Tear","injury_sport":"Football","body_part":"Knee","pain_location":"Inside or outside of knee","swelling":"Yes","bruising":"Sometimes","instability":"Sometimes","limited_range_of_motion":"Yes","audible_pop":"Sometimes"},{"injury_id":37,"injury_name":"Ankle Sprain","injury_sport":"Soccer","body_part":"Ankle","pain_location":"Outside of ankle","swelling":"Yes","bruising":"Yes","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Sometimes"},{"injury_id":38,"injury_name":"Achilles Tendonitis","injury_sport":"Soccer","body_part":"Achilles Tendon","pain_location":"Back of Ankle","swelling":"Sometimes","bruising":"No","instability":"No","limited_range_of_motion":"Sometimes","audible_pop":"No"},{"injury_id":39,"injury_name":"Achilles Tendon Rupture","injury_sport":"Soccer","body_part":"Calf","pain_location":"Lower calf","swelling":"Yes","bruising":"Sometimes","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Yes"},{"injury_id":40,"injury_name":"ACL Tear","injury_sport":"Soccer","body_part":"Knee","pain_location":"Deep inside of knee","swelling":"Yes","bruising":"Sometimes","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Yes"},{"injury_id":41,"injury_name":"MCL Tear","injury_sport":"Soccer","body_part":"Knee","pain_location":"Inner side of knee","swelling":"Yes","bruising":"Sometimes","instability":"Yes","limited_range_of_motion":"Sometimes","audible_pop":"Sometimes"},{"injury_id":42,"injury_name":"Concussion","injury_sport":"Soccer","body_part":"Head","pain_location":"Head","swelling":"No","bruising":"No","instability":"Sometimes","limited_range_of_motion":"No","audible_pop":"No"},{"injury_id":43,"injury_name":"Groin Strain","injury_sport":"Soccer","body_part":"Groin","pain_location":"Groin, can radiate outward to pelvic area","swelling":"Sometimes","bruising":"Sometimes","instability":"No","limited_range_of_motion":"Sometimes","audible_pop":"Sometimes"},{"injury_id":44,"injury_name":"Hamstring Strain","injury_sport":"Soccer","body_part":"Thigh","pain_location":"Back of thigh","swelling":"Sometimes","bruising":"Sometimes","instability":"No","limited_range_of_motion":"Yes","audible_pop":"Sometimes"},{"injury_id":45,"injury_name":"Shin Splint","injury_sport":"Soccer","body_part":"Shin","pain_location":"Front of shin","swelling":"No","bruising":"No","instability":"No","limited_range_of_motion":"No","audible_pop":"No"},{"injury_id":46,"injury_name":"Turf Toe","injury_sport":"Soccer","body_part":"Big Toe","pain_location":"Base of big toe","swelling":"Yes","bruising":"Sometimes","instability":"Sometimes","limited_range_of_motion":"Yes","audible_pop":"Sometimes"},{"injury_id":47,"injury_name":"Calf Strain","injury_sport":"Soccer","body_part":"Calf","pain_location":"Back of lower leg","swelling":"Sometimes","bruising":"Sometimes","instability":"No","limited_range_of_motion":"Yes","audible_pop":"Sometimes"},{"injury_id":48,"injury_name":"Shoulder Dislocation","injury_sport":"Soccer","body_part":"Shoulder","pain_location":"Outer shoulder/deltoid area","swelling":"Yes","bruising":"No","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Yes"}],"severities":[{"severity_id":"1Mi","severity":"Mild","frequency":1.47,"recovery_time_avg":2,"can_continue_playing":"Yes","injury_id":1},{"severity_id":"1Mo","severity":"Moderate","frequency":1.47,"recovery_time_avg":4,"can_continue_playing":"No","injury_id":1},{"severity_id":"1Se","severity":"Severe","frequency":1.47,"recovery_time_avg":12,"can_continue_playing":"No","injury_id":1},{"severity_id":"2Se","severity":"Severe","frequency":0.07,"recovery_time_avg":52,"can_continue_playing":"No","injury_id":2},{"severity_id":"3Mo","severity":"Moderate","frequency":0.07,"recovery_time_avg":4,"can_continue_playing":"Yes","injury_id":3},{"severity_id":"3Se","severity":"Severe","frequency":0.07,"recovery_time_avg":16,"can_continue_playing":"No","injury_id":3},{"severity_id":"4Mi","severity":"Mild","frequency":0.12,"recovery_time_avg":4,"can_continue_playing":"Yes","injury_id":4},{"severity_id":"4Mo","severity":"Moderate","frequency":0.12,"recovery_time_avg":12,"can_continue_playing":"Yes","injury_id":4},{"severity_id":"5Se","severity":"Severe","frequency":0.01,"recovery_time_avg":52,"can_continue_playing":"No","injury_id":5},{"severity_id":"6Mi","severity":"Mild","frequency":0.3,"recovery_time_avg":2,"can_continue_playing":"Yes","injury_id":6},{"severity_id":"6Mo","severity":"Moderate","frequency":0.3,"recovery_time_avg":4,"can_continue_playing":"Yes","injury_id":6},{"severity_id":"7Mo","severity":"Moderate","frequency":0.1,"recovery_time_avg":4,"can_continue_playing":"No","injury_id":7},{"severity_id":"7Se","severity":"Severe","frequency":0.1,"recovery_time_avg":6,"can_continue_playing":"No","injury_id":7},{"severity_id":"8Mi","severity":"Mild","frequency":0.18,"recovery_time_avg":3,"can_continue_playing":"No","injury_id":8},{"severity_id":"8Mo","severity":"Moderate","frequency":0.18,"recovery_time_avg":6,"can_continue_playing":"No","injury_id":8},{"severity_id":"9Mi","severity":"Mild","frequency":0.2,"recovery_time_avg":3,"can_continue_playing":"Yes","injury_id":9},{"severity_id":"9Mo","severity":"Moderate","frequency":0.2,"recovery_time_avg":6,"can_continue_playing":"No","injury_id":9},{"severity_id":"9Se","severity":"Severe","frequency":0.2,"recovery_time_avg":12,"can_continue_playing":"No","injury_id":9},{"severity_id":"10Mo","severity":"Moderate","frequency":0.34,"recovery_time_avg":3,"can_continue_playing":"No","injury_id":10},{"severity_id":"11Mi","severity":"Mild","frequency":0.15,"recovery_time_avg":1,"can_continue_playing":"Yes","injury_id":11},{"severity_id":"11Mo","severity":"Moderate","frequency":0.15,"recovery_time_avg":2,"can_continue_playing":"Yes","injury_id":11},{"severity_id":"12Mo","severity":"Moderate","frequency":0.05,"recovery_time_avg":4,"can_continue_playing":"No","injury_id":12},{"severity_id":"12Se","severity":"Severe","frequency":0.05,"recovery_time_avg":8,"can_continue_playing":"No","injury_id":12},{"severity_id":"13Mi","severity":"Mild","frequency":0.15,"recovery_time_avg":2,"can_continue_playing":"Yes","injury_id":13},{"severity_id":"13Mo","severity":"Moderate","frequency":0.15,"recovery_time_avg":6,"can_continue_playing":"Yes","injury_id":13},{"severity_id":"14Mo","severity":"Moderate","frequency":0.03,"recovery_time_avg":12,"can_continue_playing":"No","injury_id":14},{"severity_id":"14Se","severity":"Severe","frequency":0.03,"recovery_time_avg":24,"can_continue_playing":"No","injury_id":14},{"severity_id":"15Mi","severity":"Mild","frequency":0.07,"recovery_time_avg":12,"can_continue_playing":"No","injury_id":15},{"severity_id":"15Mo","severity":"Moderate","frequency":0.07,"recovery_time_avg":24,"can_continue_playing":"No","injury_id":15},{"severity_id":"16Mo","severity":"Moderate","frequency":0.04,"recovery_time_avg":52,"can_continue_playing":"No","injury_id":16},{"severity_id":"16Se","severity":"Severe","frequency":0.04,"recovery_time_avg":78,"can_continue_playing":"No","injury_id":16},{"severity_id":"17Mo","severity":"Moderate","frequency":0.08,"recovery_time_avg":16,"can_continue_playing":"No","injury_id":17},{"severity_id":"17Se","severity":"Severe","frequency":0.08,"recovery_time_avg":52,"can_continue_playing":"No","injury_id":17},{"severity_id":"18Mo","severity":"Moderate","frequency":0.05,"recovery_time_avg":4,"can_continue_playing":"No","injury_id":18},{"severity_id":"19Mi","severity":"Mild","frequency":0.25,"recovery_time_avg":1,"can_continue_playing":"Yes","injury_id":19},{"severity_id":"19Mo","severity":"Moderate","frequency":0.25,"recovery_time_avg":3,"can_continue_playing":"No","injury_id":19},{"severity_id":"19Se","severity":"Severe","frequency":0.25,"recovery_time_avg":6,"can_continue_playing":"No","injury_id":19},{"severity_id":"20Mi","severity":"Mild","frequency":0.37,"recovery_time_avg":2,"can_continue_playing":"No","injury_id":20},{"severity_id":"20Mo","severity":"Moderate","frequency":0.37,"recovery_time_avg":4,"can_continue_playing":"No","injury_id":20},{"severity_id":"20Se","severity":"Severe","frequency":0.37,"recovery_time_avg":12,"can_continue_playing":"No","injury_id":20},{"severity_id":"21Mo","severity":"Moderate","frequency":0.09,"recovery_time_avg":3,"can_continue_playing":"No","injury_id":21},{"severity_id":"22Mi","severity":"Mild","frequency":0.2,"recovery_time_avg":1,"can_continue_playing":"Yes","injury_id":22},{"severity_id":"22Mo","severity":"Moderate","frequency":0.2,"recovery_time_avg":2,"can_continue_playing":"Yes","injury_id":22},{"severity_id":"23Mo","severity":"Moderate","frequency":0.05,"recovery_time_avg":4,"can_continue_playing":"No","injury_id":23},{"severity_id":"23Se","severity":"Severe","frequency":0.05,"recovery_time_avg":8,"can_continue_playing":"No","injury_id":23},{"severity_id":"24Mi","severity":"Mild","frequency":0.03,"recovery_time_avg":2,"can_continue_playing":"Yes","injury_id":24},{"severity_id":"24Mo","severity":"Moderate","frequency":0.03,"recovery_time_avg":4,"can_continue_playing":"Yes","injury_id":24},{"severity_id":"25Mo","severity":"Moderate","frequency":0.05,"recovery_time_avg":8,"can_continue_playing":"No","injury_id":25},{"severity_id":"25Se","severity":"Severe","frequency":0.05,"recovery_time_avg":24,"can_continue_playing":"No","injury_id":25},{"severity_id":"26Mi","severity":"Mild","frequency":0.1,"recovery_time_avg":3,"can_continue_playing":"Yes","injury_id":26},{"severity_id":"26Mo","severity":"Moderate","frequency":0.1,"recovery_time_avg":8,"can_continue_playing":"No","injury_id":26},{"severity_id":"26Se","severity":"Severe","frequency":0.1,"recovery_time_avg":16,"can_continue_playing":"No","injury_id":26},{"severity_id":"27Se","severity":"Severe","frequency":0.07,"recovery_time_avg":52,"can_continue_playing":"No","injury_id":27},{"severity_id":"28Mo","severity":"Moderate","frequency":0.7,"recovery_time_avg":2,"can_continue_playing":"No","injury_id":28},{"severity_id":"29Mi","severity":"Mild","frequency":0.64,"recovery_time_avg":1,"can_continue_playing":"No","injury_id":29},{"severity_id":"29Mo","severity":"Moderate","frequency":0.64,"recovery_time_avg":6,"can_continue_playing":"No","injury_id":29},{"severity_id":"30Mi","severity":"Mild","frequency":0.44,"recovery_time_avg":2,"can_continue_playing":"No","injury_id":30},{"severity_id":"30Mo","severity":"Moderate","frequency":0.44,"recovery_time_avg":4,"can_continue_playing":"No","injury_id":30},{"severity_id":"30Se","severity":"Severe","frequency":0.44,"recovery_time_avg":8,"can_continue_playing":"No","injury_id":30},{"severity_id":"31Mi","severity":"Mild","frequency":0.2,"recovery_time_avg":3,"can_continue_playing":"Yes","injury_id":31},{"severity_id":"31Mo","severity":"Moderate","frequency":0.2,"recovery_time_avg":8,"can_continue_playing":"No","injury_id":31},{"severity_id":"32Mo","severity":"Moderate","frequency":0.15,"recovery_time_avg":4,"can_continue_playing":"No","injury_id":32},{"severity_id":"32Se","severity":"Severe","frequency":0.15,"recovery_time_avg":12,"can_continue_playing":"No","injury_id":32},{"severity_id":"33Mi","severity":"Mild","frequency":0.06,"recovery_time_avg":2,"can_continue_playing":"Yes","injury_id":33},{"severity_id":"33Mo","severity":"Moderate","frequency":0.06,"recovery_time_avg":4,"can_continue_playing":"No","injury_id":33},{"severity_id":"34Se","severity":"Severe","frequency":0.05,"recovery_time_avg":52,"can_continue_playing":"No","injury_id":34},{"severity_id":"35Mo","severity":"Moderate","frequency":0.1,"recovery_time_avg":6,"can_continue_playing":"No","injury_id":35},{"severity_id":"36Mo","severity":"Moderate","frequency":0.1,"recovery_time_avg":6,"can_continue_playing":"No","injury_id":36},{"severity_id":"36Se","severity":"Severe","frequency":0.1,"recovery_time_avg":12,"can_continue_playing":"No","injury_id":36},{"severity_id":"37Mi","severity":"Mild","frequency":0.78,"recovery_time_avg":3,"can_continue_playing":"Yes","injury_id":37},{"severity_id":"38Mo","severity":"Moderate","frequency":0.05,"recovery_time_avg":9,"can_continue_playing":"Yes","injury_id":38},{"severity_id":"39Se","severity":"Severe","frequency":0.01,"recovery_time_avg":39,"can_continue_playing":"No","injury_id":39},{"severity_id":"40Se","severity":"Severe","frequency":0.1,"recovery_time_avg":52,"can_continue_playing":"No","injury_id":40},{"severity_id":"41Mo","severity":"Moderate","frequency":0.08,"recovery_time_avg":6,"can_continue_playing":"No","injury_id":41},{"severity_id":"42Mo","severity":"Moderate","frequency":0.44,"recovery_time_avg":2,"can_continue_playing":"No","injury_id":42},{"severity_id":"43Mo","severity":"Moderate","frequency":0.45,"recovery_time_avg":4,"can_continue_playing":"No","injury_id":43},{"severity_id":"44Mi","severity":"Mild","frequency":0.6,"recovery_time_avg":3,"can_continue_playing":"Yes","injury_id":44},{"severity_id":"45Mo","severity":"Moderate","frequency":0.2,"recovery_time_avg":4,"can_continue_playing":"No","injury_id":45},{"severity_id":"46Mo","severity":"Moderate","frequency":0.04,"recovery_time_avg":4,"can_continue_playing":"No","injury_id":46},{"severity_id":"47Mo","severity":"Moderate","frequency":0.25,"recovery_time_avg":4,"can_continue_playing":"No","injury_id":47},{"severity_id":"48Mo","severity":"Moderate","frequency":0.15,"recovery_time_avg":4,"can_continue_playing":"No","injury_id":48},{"severity_id":"48Se","severity":"Severe","frequency":0.15,"recovery_time_avg":12,"can_continue_playing":"No","injury_id":48}],"moves":[{"move_id":1,"move_name":"Driving to the Basket","move_description":"Dribble-drive toward the hoop, often with a defender in pursuit"},{"move_id":2,"move_name":"Jump Shot (shooting motion)","move_description":"Repetitive jumping and shooting mechanics"},{"move_id":3,"move_name":"Landing from a Jump","move_description":"Coming down from a rebound, layup, or shot attempt"},{"move_id":4,"move_name":"Cutting/Changing Direction","move_description":"Crossovers, defensive slides, and sudden direction changes"},{"move_id":5,"move_name":"Boxing Out/Post-Up","move_description":"Physical positioning and contact battling for space"},{"move_id":6,"move_name":"Blocking or Contesting a Shot","move_description":"Reaching to alter or block an opponent's shot"},{"move_id":7,"move_name":"Diving for a Loose Ball / Falling","move_description":"Diving on the floor or falling from contact"},{"move_id":8,"move_name":"Fast Break Sprint","move_description":"Explosive full-speed running in transition"},{"move_id":9,"move_name":"Pitching","move_description":"Full overhead throwing motion (wind-up through follow-through)"},{"move_id":10,"move_name":"Batting/Swing","move_description":"Rotational swing to hit a pitched ball"},{"move_id":11,"move_name":"Base Running","move_description":"Sprinting between bases"},{"move_id":12,"move_name":"Sliding","move_description":"Feet-first or head-first slide into a base"},{"move_id":13,"move_name":"Fielding a Ground Ball","move_description":"Bending/lateral movement to field, followed by a throw"},{"move_id":14,"move_name":"Catching/Blocking (catcher)","move_description":"Repetitive squatting, blocking, framing"},{"move_id":15,"move_name":"Diving/Collision","move_description":"Diving for a catch or colliding with wall/player"},{"move_id":16,"move_name":"Hit By Pitch","move_description":"Direct ball contact with batter/catcher"},{"move_id":17,"move_name":"Tackling / Collision","move_description":"Direct physical contact with another player involving forceful impact between the body or limbs"},{"move_id":18,"move_name":"Sudden Cutting","move_description":"Rapidly changing direction while running, placing high stress on the knees, ankles, and other lower-extremity joints"},{"move_id":19,"move_name":"Explosive Sprinting","move_description":"Rapidly accelerating from a stationary or slow position, requiring sudden, powerful contraction of the leg muscles"},{"move_id":20,"move_name":"Absorbing Contact","move_description":"Bracing for and receiving physical impact from another player or external force while maintaining balance and body position"},{"move_id":21,"move_name":"Landing After Jump","move_description":"Returning to the ground after jumping, requiring controlled absorption of body weight and impact through the ankles, knees, and hips"},{"move_id":22,"move_name":"Running/Sprinting","move_description":"High-speed movement to chase the ball or create space"},{"move_id":23,"move_name":"Passing","move_description":"Striking the ball to a teammate with control and accuracy"},{"move_id":24,"move_name":"Kicking/Shooting","move_description":"Forceful strike on the ball, usually aimed at goal"},{"move_id":25,"move_name":"Dribbling","move_description":"Close ball control while moving past defenders"},{"move_id":26,"move_name":"Receiving/Trapping","move_description":"Controlling an incoming ball with foot, chest, or thigh"},{"move_id":27,"move_name":"Heading","move_description":"Using the head to pass, clear, or score"},{"move_id":28,"move_name":"Jumping/Landing","move_description":"Vertical leap (often for headers) with controlled landing"},{"move_id":29,"move_name":"Sliding Tackle","move_description":"Sliding on the ground to dispossess an opponent"},{"move_id":30,"move_name":"Goalkeeper Save/Dive","move_description":"Diving or reaching to stop the ball from entering the goal"}],"moveInjury":[{"move_id":1,"injury_id":2},{"move_id":1,"injury_id":1},{"move_id":2,"injury_id":4},{"move_id":2,"injury_id":9},{"move_id":3,"injury_id":1},{"move_id":3,"injury_id":2},{"move_id":4,"injury_id":2},{"move_id":4,"injury_id":8},{"move_id":5,"injury_id":9},{"move_id":5,"injury_id":6},{"move_id":5,"injury_id":7},{"move_id":6,"injury_id":6},{"move_id":6,"injury_id":7},{"move_id":6,"injury_id":11},{"move_id":6,"injury_id":12},{"move_id":7,"injury_id":11},{"move_id":7,"injury_id":12},{"move_id":7,"injury_id":10},{"move_id":8,"injury_id":8},{"move_id":8,"injury_id":5},{"move_id":9,"injury_id":16},{"move_id":9,"injury_id":13},{"move_id":9,"injury_id":14},{"move_id":10,"injury_id":18},{"move_id":10,"injury_id":17},{"move_id":11,"injury_id":19},{"move_id":11,"injury_id":20},{"move_id":12,"injury_id":20},{"move_id":12,"injury_id":22},{"move_id":12,"injury_id":23},{"move_id":13,"injury_id":19},{"move_id":13,"injury_id":24},{"move_id":13,"injury_id":25},{"move_id":14,"injury_id":24},{"move_id":14,"injury_id":25},{"move_id":14,"injury_id":21},{"move_id":15,"injury_id":21},{"move_id":15,"injury_id":20},{"move_id":16,"injury_id":22},{"move_id":16,"injury_id":23},{"move_id":16,"injury_id":21},{"move_id":17,"injury_id":28},{"move_id":17,"injury_id":32},{"move_id":18,"injury_id":27},{"move_id":18,"injury_id":29},{"move_id":19,"injury_id":30},{"move_id":19,"injury_id":34},{"move_id":20,"injury_id":31},{"move_id":20,"injury_id":35},{"move_id":21,"injury_id":29},{"move_id":21,"injury_id":36},{"move_id":22,"injury_id":44},{"move_id":22,"injury_id":47},{"move_id":23,"injury_id":44},{"move_id":23,"injury_id":43},{"move_id":24,"injury_id":44},{"move_id":24,"injury_id":43},{"move_id":25,"injury_id":37},{"move_id":25,"injury_id":40},{"move_id":26,"injury_id":37},{"move_id":26,"injury_id":41},{"move_id":27,"injury_id":42},{"move_id":27,"injury_id":37},{"move_id":28,"injury_id":37},{"move_id":28,"injury_id":40},{"move_id":29,"injury_id":41},{"move_id":29,"injury_id":37},{"move_id":30,"injury_id":48},{"move_id":30,"injury_id":37},{"move_id":30,"injury_id":40}]};

/* ---------------------------------------------------------------
   PROVISIONAL ADDITIONS
   Injuries the 20-case test sheet exposed as missing from the database.
   Symptom profiles, recovery times, and frequencies are general
   sports-medicine estimates. The team (and a clinician) should verify
   them, or replace them with sourced data, before anyone relies on them.
--------------------------------------------------------------- */
const EXTRA_INJURIES = [
  { injury_id: 49, injury_name: 'Patellar Fracture', injury_sport: 'Basketball', body_part: 'Knee',
    pain_location: 'Front of the knee, over the kneecap',
    swelling: 'Yes', bruising: 'Sometimes', instability: 'Sometimes', limited_range_of_motion: 'Yes', audible_pop: 'Sometimes' },
  { injury_id: 50, injury_name: 'MCL Sprain', injury_sport: 'Basketball', body_part: 'Knee',
    pain_location: 'Inner side of the knee',
    swelling: 'Yes', bruising: 'Sometimes', instability: 'Yes', limited_range_of_motion: 'Yes', audible_pop: 'Sometimes' },
  { injury_id: 51, injury_name: 'Knee Hyperextension', injury_sport: 'Basketball', body_part: 'Knee',
    pain_location: 'Back of the knee, sometimes the front, worse when straightening',
    swelling: 'Yes', bruising: 'Sometimes', instability: 'Sometimes', limited_range_of_motion: 'Yes', audible_pop: 'No' },
  { injury_id: 52, injury_name: 'Quadriceps Strain', injury_sport: 'Basketball', body_part: 'Thigh',
    pain_location: 'Front of the thigh',
    swelling: 'Sometimes', bruising: 'Yes', instability: 'No', limited_range_of_motion: 'Yes', audible_pop: 'Sometimes' },
  { injury_id: 53, injury_name: 'Quadriceps Tendon Rupture', injury_sport: 'Basketball', body_part: 'Knee',
    pain_location: 'Just above the kneecap, at the quadriceps tendon',
    swelling: 'Yes', bruising: 'Sometimes', instability: 'Yes', limited_range_of_motion: 'Yes', audible_pop: 'Yes' },
  { injury_id: 54, injury_name: 'Hand Fracture (Metacarpal)', injury_sport: 'Basketball', body_part: 'Hand',
    pain_location: 'Back or side of the hand, over the broken bone',
    swelling: 'Yes', bruising: 'Yes', instability: 'Sometimes', limited_range_of_motion: 'Yes', audible_pop: 'No' },
  { injury_id: 55, injury_name: 'Foot Stress Fracture', injury_sport: 'Basketball', body_part: 'Foot',
    pain_location: 'Top or middle of the foot, aching with activity',
    swelling: 'Sometimes', bruising: 'No', instability: 'No', limited_range_of_motion: 'Yes', audible_pop: 'No' },
  { injury_id: 56, injury_name: 'Tibia / Fibula Fracture', injury_sport: 'Basketball', body_part: 'Lower Leg',
    pain_location: 'Along the shin bone',
    swelling: 'Yes', bruising: 'Yes', instability: 'Yes', limited_range_of_motion: 'Yes', audible_pop: 'Sometimes' },
];

const sev = (id, sevName, frequency, weeks, canPlay, injuryId) => ({
  severity_id: id, severity: sevName, frequency, recovery_time_avg: weeks,
  can_continue_playing: canPlay, injury_id: injuryId,
});

const EXTRA_SEVERITIES = [
  sev('49Mo', 'Moderate', 0.02, 8, 'No', 49), sev('49Se', 'Severe', 0.02, 16, 'No', 49),
  sev('50Mi', 'Mild', 0.07, 3, 'Yes', 50), sev('50Mo', 'Moderate', 0.07, 8, 'No', 50),
  sev('51Mi', 'Mild', 0.10, 2, 'Yes', 51), sev('51Mo', 'Moderate', 0.10, 4, 'No', 51),
  sev('52Mi', 'Mild', 0.15, 2, 'Yes', 52), sev('52Mo', 'Moderate', 0.15, 4, 'No', 52), sev('52Se', 'Severe', 0.15, 8, 'No', 52),
  sev('53Se', 'Severe', 0.01, 26, 'No', 53),
  sev('54Mo', 'Moderate', 0.10, 6, 'No', 54), sev('54Se', 'Severe', 0.10, 12, 'No', 54),
  sev('55Mo', 'Moderate', 0.05, 8, 'No', 55), sev('55Se', 'Severe', 0.05, 26, 'No', 55),
  sev('56Se', 'Severe', 0.01, 24, 'No', 56),
];

// [move_id, injury_id]. Basketball moves are 1 to 8.
const EXTRA_MOVE_LINKS = [
  [3, 49], [4, 49], [7, 49],
  [1, 50], [4, 50], [5, 50],
  [3, 51], [6, 51], [7, 51],
  [1, 52], [4, 52], [8, 52],
  [3, 53], [4, 53],
  [5, 54], [6, 54], [7, 54],
  [2, 55], [3, 55], [8, 55],
  [3, 56], [6, 56], [7, 56],
  // extra mechanisms for injuries already in the database
  [4, 1],            // ankle sprain from cutting / defensive slides
  [1, 5], [4, 5],    // Achilles rupture on push-off while driving or cutting
  [4, 3],            // meniscus tear from planting and pivoting
];

export const DB = (() => {
  const moveInjury = [...BASE_DB.moveInjury];
  const seen = new Set(moveInjury.map(mi => `${mi.move_id}:${mi.injury_id}`));
  EXTRA_MOVE_LINKS.forEach(([m, i]) => {
    if (!seen.has(`${m}:${i}`)) { moveInjury.push({ move_id: m, injury_id: i }); seen.add(`${m}:${i}`); }
  });
  return {
    injuries: [...BASE_DB.injuries, ...EXTRA_INJURIES],
    severities: [...BASE_DB.severities, ...EXTRA_SEVERITIES],
    moves: BASE_DB.moves,
    moveInjury,
  };
})();

export const SYMPTOM_FIELDS = [
  { key: 'swelling', label: 'Swelling', hint: 'Puffiness or fluid buildup around the area' },
  { key: 'bruising', label: 'Bruising', hint: 'Discoloration under the skin' },
  { key: 'instability', label: 'Instability', hint: 'Feels like it could give out or shift' },
  { key: 'limited_range_of_motion', label: 'Limited motion', hint: "Can't move it through its full range" },
  { key: 'audible_pop', label: 'Audible pop', hint: 'Heard or felt a pop or snap at the moment of injury' },
];

/* ---------------------------------------------------------------
   BODY AREAS
   What people can pick (or type). Each area says which database
   body_part labels it points at and how strongly: 1 = same spot,
   less than 1 = nearby or related. `hint` is checked against an
   injury's pain_location text for a small bonus.
--------------------------------------------------------------- */
export const BODY_GROUPS = [
  'Head and neck', 'Shoulder and arm', 'Torso', 'Hip and thigh', 'Knee', 'Lower leg and foot',
];

export const BODY_AREAS = [
  { id: 'head', label: 'Head', group: 'Head and neck', db: { Head: 1 },
    words: /\bhead\b|skull|concussion|brain|forehead|temple|\bface\b|\bjaw\b/ },
  { id: 'neck', label: 'Neck', group: 'Head and neck', db: { Head: 0.3 },
    words: /\bneck\b|cervical|whiplash/ },

  { id: 'shoulder', label: 'Shoulder', group: 'Shoulder and arm', db: { Shoulder: 1, Chest: 0.2 },
    words: /shoulder(?! blade)|collarbone|clavicle|rotator|\bac joint\b/ },
  { id: 'upper_arm', label: 'Upper arm', group: 'Shoulder and arm', db: { Shoulder: 0.4, Elbow: 0.4 },
    words: /\bbicep|\btricep|upper arm|\barm\b/ },
  { id: 'elbow', label: 'Elbow', group: 'Shoulder and arm', db: { Elbow: 1 },
    words: /elbow|\bucl\b/ },
  { id: 'forearm', label: 'Forearm', group: 'Shoulder and arm', db: { Elbow: 0.4, Wrist: 0.4 },
    words: /forearm/ },
  { id: 'wrist', label: 'Wrist', group: 'Shoulder and arm', db: { Wrist: 1, Hand: 0.4 },
    words: /wrist/ },
  { id: 'hand', label: 'Hand', group: 'Shoulder and arm', db: { Hand: 1, 'Finger Joint': 0.5, Wrist: 0.5 },
    words: /\bhand\b|palm|knuckle|metacarpal/ },
  { id: 'fingers', label: 'Fingers or thumb', group: 'Shoulder and arm', db: { 'Finger Joint': 1, Hand: 0.5 },
    words: /finger|thumb|\bpinky\b/ },

  { id: 'chest', label: 'Chest or ribs', group: 'Torso', db: { Chest: 1, Torso: 0.4 },
    words: /\bchest\b|\bribs?\b|ribcage|sternum|\bpecs?\b/ },
  { id: 'side', label: 'Side or abdomen', group: 'Torso', db: { Torso: 1, Chest: 0.4, 'Lower Back': 0.3 },
    words: /abdomen|abdominal|\babs\b|oblique|stomach|\bcore\b|torso|\bflank\b/ },
  { id: 'upper_back', label: 'Upper back', group: 'Torso', db: { Torso: 0.4, 'Lower Back': 0.4, Shoulder: 0.3 },
    words: /upper back|\bmid(dle)? back|shoulder blade|scapula|thoracic/ },
  { id: 'lower_back', label: 'Lower back', group: 'Torso', db: { 'Lower Back': 1, Torso: 0.3 },
    words: /low(er)? back|lumbar|\bspine\b|\bback\b/ },

  { id: 'hip_groin', label: 'Hip or groin', group: 'Hip and thigh', db: { Groin: 1, Hamstring: 0.3, Thigh: 0.3 },
    words: /\bhip\b|groin|pelvi|glute|buttock|\bbutt\b/ },
  { id: 'quad', label: 'Front of thigh (quad)', group: 'Hip and thigh', db: { Thigh: 1, Hamstring: 0.5, Knee: 0.3 },
    hint: /front of (the )?thigh|quad/i, words: /\bquad(s|riceps)?\b|front of (the |my )?thigh/ },
  { id: 'hamstring', label: 'Back of thigh (hamstring)', group: 'Hip and thigh', db: { Hamstring: 1, Thigh: 0.6 },
    hint: /back of (the )?thigh|hamstring/i, words: /\bhamstrings?\b|back of (the |my )?thigh/ },

  { id: 'knee', label: 'Knee', group: 'Knee', db: { Knee: 1, Thigh: 0.2 },
    words: /\bknee(?!cap)|\bacl\b|\bpcl\b|\bmcl\b|\blcl\b|meniscus|\bit band\b/ },
  { id: 'kneecap', label: 'Kneecap (front of knee)', group: 'Knee', db: { Knee: 1 },
    hint: /over the kneecap|below the kneecap|around the kneecap|patell/i, words: /kneecap|patell/ },

  { id: 'shin', label: 'Shin or lower leg bone', group: 'Lower leg and foot', db: { Shin: 1, 'Lower Leg': 1, Calf: 0.4 },
    words: /\bshin|tibia|fibula|lower leg|leg bone/ },
  { id: 'calf', label: 'Calf', group: 'Lower leg and foot', db: { Calf: 1, 'Lower Calf': 0.8, 'Achilles Tendon': 0.4, 'Lower Leg': 0.3 },
    words: /\bcalf\b|\bcalves\b/ },
  { id: 'achilles', label: 'Achilles tendon (back of ankle)', group: 'Lower leg and foot', db: { 'Achilles Tendon': 1, 'Lower Calf': 1, Calf: 0.5, Ankle: 0.3 },
    words: /achilles|heel cord/ },
  { id: 'ankle', label: 'Ankle', group: 'Lower leg and foot', db: { Ankle: 1, 'Achilles Tendon': 0.4, 'Lower Calf': 0.2, 'Lower Leg': 0.2, Foot: 0.3 },
    words: /\bankle/ },
  { id: 'foot', label: 'Foot, heel, or arch', group: 'Lower leg and foot', db: { Foot: 1, 'Big Toe': 0.5, Ankle: 0.3 },
    words: /\bfoot\b|\bfeet\b|\bheel\b|\barch\b|midfoot|navicular|plantar|metatarsal|\bsole\b/ },
  { id: 'toes', label: 'Toes or big toe', group: 'Lower leg and foot', db: { 'Big Toe': 1, Foot: 0.5 },
    words: /\btoes?\b|big toe/ },
];

/** Read free text such as "top of my foot near the heel" and return matching area ids. */
export function recognizeAreas(text) {
  const t = (text || '').toLowerCase();
  if (!t.trim()) return [];
  const found = new Set();
  BODY_AREAS.forEach(a => { if (a.words.test(t)) found.add(a.id); });

  // "thigh" on its own could be front or back, so allow both
  if (/\bthighs?\b/.test(t) && !found.has('quad') && !found.has('hamstring')) {
    found.add('quad'); found.add('hamstring');
  }
  // a bare "back" means lower back unless they said upper back or back of something
  if (found.has('lower_back') && !/low(er)? back|lumbar|\bspine\b/.test(t)) {
    if (found.has('upper_back') || /back of/.test(t) || /\bback\b.*\b(thigh|knee|leg|ankle|calf)\b/.test(t)) {
      found.delete('lower_back');
    }
  }
  return [...found];
}

export function areaLabels(ids) {
  return ids.map(id => (BODY_AREAS.find(a => a.id === id) || {}).label).filter(Boolean);
}

/* ---------------------------------------------------------------
   MOVEMENTS
   Free-text recognition for the "Other" box under "What were you doing?".
   Keys are move_id values from the MOVE table.
--------------------------------------------------------------- */
const MOVE_WORDS = {
  // Basketball
  1: /\bdriv(e|es|ing)\b|lay-?up|\bdunk|to the (basket|rim)|attack(ing)? the (rim|basket)/,
  2: /jump ?shot|\bjumper\b|shooting motion|\bshoot(ing)?\b/,
  3: /\bland(s|ed|ing)?\b|came down|coming down|\brebound/,
  4: /\bcut(s|ting)?\b|chang(e|ing) (of )?direction|\bpivot|\bplant(ed|ing)?\b|cross-?over|sidestep|\bjuke|defensive slide/,
  5: /box(ed|ing)? out|post(ing)?[- ]?up|\bpost\b|\bcollid|\bcollision|\bcontact\b|\bbump(ed)?\b|\bscreen\b/,
  6: /\bblock(ed|ing)?\b|\bcontest(ed|ing)?\b|\breach(ed|ing)?\b|\bswat/,
  7: /\bdiv(e|ed|ing)\b|\bfall(s|ing|en)?\b|\bfell\b|loose ball|\btrip(ped)?\b|\bslip(ped)?\b|outstretched/,
  8: /\bsprint|fast ?break|\brunn?ing\b|\bran\b|\brun\b|transition|break ?away/,
  // Baseball
  9: /(?<!by (a )?)\bpitch(ed|ing|es)?\b|\bthrow(ing|n|s)?\b|\bthrew\b|wind-?up|overhead/,
  10: /\bbat(ting|ted)?\b|\bswing(ing)?\b|\bswung\b|\bhitting\b/,
  11: /base ?runn|\brunn?ing\b|\bsprint|\bsteal(ing)?\b|\bran\b/,
  12: /\bslid(e|ing)?\b|\bslides\b/,
  13: /\bfield(ing|ed)?\b|ground ball|\bthrow/,
  14: /\bcatch(er|ing)?\b|\bsquat|\bframing\b|\bblock(ing)?\b/,
  15: /\bdiv(e|ed|ing)\b|\bcollid|\bcollision\b|\bwall\b|\bcrash/,
  16: /hit by|\bhbp\b|\bstruck\b|beaned|plunked/,
  // Football
  17: /\btackl(e|ed|ing)\b|\bcollid|\bcollision\b|\bhit\b|\bsack(ed)?\b|\bpiled\b/,
  18: /\bcut(s|ting)?\b|chang(e|ing) (of )?direction|\bpivot|\bplant|\bjuke|\bsidestep/,
  19: /\bsprint|explosive|accelerat|\bran\b|\brunn?ing\b|burst/,
  20: /\bblock(ed|ing)?\b|absorb|\bcontact\b|\bbrac(e|ed|ing)\b|\bpush(ed|ing)?\b/,
  21: /\bland(s|ed|ing)?\b|\bjump(ed|ing)?\b|came down/,
  // Soccer
  22: /\bsprint|\brunn?ing\b|\bran\b|\bchas(e|ed|ing)\b/,
  23: /\bpass(ed|ing|es)?\b/,
  24: /\bkick(ed|ing)?\b|\bshoot(ing)?\b|\bshot\b|\bstrik(e|ing)\b|\bstruck\b/,
  25: /\bdribbl/,
  26: /\breceiv|\btrap(ping|ped)?\b|\bcontrol(ling|led)?\b/,
  27: /\bhead(er|ing|ed|ers)?\b/,
  28: /\bjump(ed|ing)?\b|\bland(ed|ing)?\b|\bleap/,
  29: /slid(e|ing) tackle|\bslid(e|ing)\b|\btackl(e|ed|ing)\b/,
  30: /goal ?keeper|\bkeeper\b|\bsave\b|\bdiv(e|ed|ing)\b|\bkeeping\b/,
};

export function movesForSport(sport) {
  const injuryIds = new Set(DB.injuries.filter(i => i.injury_sport === sport).map(i => i.injury_id));
  const moveIds = new Set(DB.moveInjury.filter(mi => injuryIds.has(mi.injury_id)).map(mi => mi.move_id));
  return DB.moves.filter(m => moveIds.has(m.move_id));
}

/** Read free text such as "landed awkwardly after a dunk" and return matching move ids for this sport. */
export function recognizeMoves(text, sport) {
  const t = (text || '').toLowerCase();
  if (!t.trim()) return [];
  const allowed = new Set(movesForSport(sport).map(m => m.move_id));
  return Object.entries(MOVE_WORDS)
    .filter(([id, re]) => allowed.has(Number(id)) && re.test(t))
    .map(([id]) => Number(id));
}

/* ---------------------------------------------------------------
   MATCHING
--------------------------------------------------------------- */
const SYMPTOM_KEYS = SYMPTOM_FIELDS.map(f => f.key);
const SEVERITY_ORDER = ['Mild', 'Moderate', 'Severe'];

function frequencyOf(injuryId) {
  const rows = DB.severities.filter(s => s.injury_id === injuryId);
  return rows.length ? Math.max(...rows.map(r => r.frequency)) : 0;
}

/**
 * Pick the severity row that best fits what was reported. The starting point
 * is the mildest listed row (several injuries list one shared frequency across
 * rows, so "most common" cannot separate them). Reporting three or more
 * symptoms moves it up to at least Moderate, and all five to Severe.
 */
export function estimateSeverity(injuryId, symptoms = {}) {
  const rows = DB.severities
    .filter(s => s.injury_id === injuryId)
    .sort((a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity));
  if (!rows.length) return null;
  const yesCount = SYMPTOM_KEYS.filter(k => symptoms[k] === 'yes').length;
  let level = 0;
  if (yesCount >= 3) level = 1;
  if (yesCount >= 5) level = 2;
  const atOrAbove = rows.find(r => SEVERITY_ORDER.indexOf(r.severity) >= level);
  return atOrAbove || rows[rows.length - 1];
}

function bodyMatch(inj, areas) {
  let weight = 0;
  let hint = false;
  areas.forEach(a => {
    const w = a.db[inj.body_part] || 0;
    if (w > weight) weight = w;
    if (w > 0 && a.hint && a.hint.test(`${inj.pain_location} ${inj.injury_name}`)) hint = true;
  });
  return { weight, hint };
}

/**
 * Score every injury on file for the sport. Where it hurts counts most,
 * then how it happened, then the symptom pattern, then how common the
 * injury is (a small tie-breaker from the frequency column).
 */
export function scoreInjuries({ sport, moveIds = [], areaIds = [], symptoms = {}, limit = 4 }) {
  const candidates = DB.injuries.filter(i => i.injury_sport === sport);
  const areas = BODY_AREAS.filter(a => areaIds.includes(a.id));
  const links = new Set(DB.moveInjury.map(mi => `${mi.move_id}:${mi.injury_id}`));

  const bodyInfo = new Map(candidates.map(inj => [inj.injury_id, bodyMatch(inj, areas)]));
  const anyInRegion = areas.length > 0 && [...bodyInfo.values()].some(b => b.weight > 0);

  return candidates
    .map(inj => {
      let score = 0;
      const reasons = [];

      const body = bodyInfo.get(inj.injury_id);
      if (areas.length > 0) {
        if (body.weight > 0) {
          score += 8 * body.weight;
          reasons.push(body.weight >= 1 ? 'Same body part' : 'Close to where it hurts');
          if (body.hint) score += 2;
        } else if (anyInRegion) {
          score -= 6; // other injuries do cover the area they picked, so this one is unlikely
        }
      }

      const linked = moveIds.filter(m => links.has(`${m}:${inj.injury_id}`)).length;
      if (linked > 0) {
        score += 3 + Math.min(linked - 1, 2);
        reasons.push('Matches how this usually happens');
      }

      SYMPTOM_FIELDS.forEach(({ key, label }) => {
        const ans = symptoms[key];
        if (!ans || ans === 'unsure') return;
        const v = inj[key];
        const w = key === 'audible_pop' ? 3 : 2;
        if (v === 'Sometimes') {
          score += 0.5;
        } else if ((v === 'Yes' && ans === 'yes') || (v === 'No' && ans === 'no')) {
          score += w;
          reasons.push(`Reported ${label.toLowerCase()} fits this injury`);
        } else {
          score -= w;
        }
      });

      score += Math.min(1.5, 1.5 * Math.sqrt(frequencyOf(inj.injury_id)));

      return { ...inj, score, reasons, severity: estimateSeverity(inj.injury_id, symptoms) };
    })
    .sort((a, b) => b.score - a.score || frequencyOf(b.injury_id) - frequencyOf(a.injury_id))
    .filter(r => r.score > 0)
    .slice(0, limit);
}

export function decideTier({ redFlags, weightBearing, topMatch }) {
  if (Object.values(redFlags).some(v => v === 'yes')) return 'emergency';
  if (weightBearing !== 'yes') return 'urgent'; // 'no' or 'unsure' both default to caution
  if (!topMatch || !topMatch.severity) return 'clinician';
  const level = topMatch.severity.severity;
  if (level === 'Severe') return 'urgent';
  if (level === 'Moderate') return 'clinician';
  return 'selfcare';
}
