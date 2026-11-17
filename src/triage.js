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
   Injuries that tester feedback (Mihir's 20-case sheet, then the
   80-case sheet from 11/15/2026) showed were missing. Symptom
   profiles, recovery times, frequencies, contact patterns, and
   red-flag links are general sports-medicine estimates written by
   Claude, NOT sourced data and NOT clinician reviewed. The team (and
   a clinician) should check them before anyone relies on them.
--------------------------------------------------------------- */
export const SPORTS = ['Basketball', 'Baseball', 'Football', 'Soccer'];
const ALL = SPORTS;
const SPORT_IDX = { Basketball: 1, Baseball: 2, Football: 3, Soccer: 4 };
const YNS = { Y: 'Yes', N: 'No', S: 'Sometimes' };

/*
 * profile fields (all optional):
 *   contact:  'contact' | 'noncontact' | 'either'  (how it usually happens)
 *   major:    true for fractures, ruptures and full tears (usually can't bear weight or keep playing)
 *   flags:    which safety-check answers this injury tends to produce, 'Y' (usually) or 'S' (sometimes)
 *             keys: deformity, nerve, wound, loc, collapse
 *   mech:     movement tags (see MOVE_TAGS) that commonly cause it
 *   body_part: override the database body part
 */
function x(id, name, sports, body_part, pain_location, sx, profile, severities) {
  const [swelling, bruising, instability, limited_range_of_motion, audible_pop] = sx.split('').map(c => YNS[c]);
  return { id, name, sports, body_part, pain_location, swelling, bruising, instability, limited_range_of_motion, audible_pop, profile, severities };
}

const ACL_PROFILE = { contact: 'either', major: true, mech: ['cutting', 'landing', 'jump', 'sprint'] };

const EXTRA_INJURIES = [
  // knee
  x(49, 'Patellar (Kneecap) Fracture', ALL, 'Kneecap', 'Front of the knee, over the kneecap', 'YSSYS',
    { contact: 'either', major: true, flags: { deformity: 'S' }, mech: ['landing', 'jump', 'fall', 'contact', 'hit_by_ball', 'cutting'] },
    [['Moderate', 0.02, 8, 'No'], ['Severe', 0.02, 16, 'No']]),
  x(50, 'MCL Sprain or Tear', ['Basketball', 'Baseball'], 'Knee', 'Inner side of the knee', 'YSYYS',
    { contact: 'contact', mech: ['contact', 'cutting', 'slide', 'fall'] },
    [['Mild', 0.07, 3, 'Yes'], ['Moderate', 0.07, 8, 'No']]),
  x(51, 'Knee Hyperextension', ['Basketball'], 'Knee', 'Back of the knee, sometimes the front, worse when straightening', 'YSSYN',
    { contact: 'either', mech: ['landing', 'jump', 'contact', 'fall'] },
    [['Mild', 0.10, 2, 'Yes'], ['Moderate', 0.10, 4, 'No']]),
  // The app can't tell "just above" from "just below" the kneecap, so the two tendon ruptures are one entry.
  x(53, 'Patellar or Quadriceps Tendon Rupture', ALL, 'Kneecap', "Just above or below the kneecap; can't straighten the leg", 'YSYYY',
    { contact: 'noncontact', major: true, mech: ['landing', 'jump', 'cutting', 'sprint'] },
    [['Severe', 0.01, 26, 'No']]),
  x(65, 'Knee Dislocation (Multiple Torn Ligaments)', ALL, 'Knee', 'Whole knee; may look out of place', 'YSYYS',
    { contact: 'either', major: true, flags: { deformity: 'Y', nerve: 'S' }, mech: ['contact', 'landing', 'cutting', 'jump'] },
    [['Severe', 0.005, 52, 'No']]),
  x(66, 'LCL Sprain or Tear', ALL, 'Knee', 'Outer side of the knee', 'YSYYS',
    { contact: 'either', mech: ['contact', 'cutting', 'landing'] },
    [['Mild', 0.03, 3, 'Yes'], ['Moderate', 0.03, 8, 'No'], ['Severe', 0.03, 20, 'No']]),
  x(67, 'ACL Tear', ['Baseball'], 'Knee', 'Deep in the knee', 'YNYYY',
    ACL_PROFILE, [['Severe', 0.03, 40, 'No']]),
  x(76, 'Knee Contusion (Deep Bruise)', ALL, 'Knee', 'The spot on the knee that was hit', 'YYNSN',
    { contact: 'contact', mech: ['contact', 'hit_by_ball', 'fall', 'slide'] },
    [['Mild', 0.20, 1, 'Yes'], ['Moderate', 0.20, 2, 'Yes']]),

  // thigh
  x(52, 'Thigh Muscle Strain or Tear (Quad)', ALL, 'Thigh', 'Front of the thigh', 'SYNYS',
    { contact: 'noncontact', mech: ['sprint', 'cutting', 'kick', 'jump'] },
    [['Mild', 0.15, 2, 'Yes'], ['Moderate', 0.15, 4, 'No'], ['Severe', 0.15, 8, 'No']]),

  // lower leg, ankle, foot
  x(56, 'Tibia / Fibula Fracture', ALL, 'Lower Leg', 'Along the shin bone; the leg may look bent', 'YYYYS',
    { contact: 'either', major: true, flags: { deformity: 'Y', wound: 'S', nerve: 'S' }, mech: ['contact', 'landing', 'fall', 'slide', 'jump'] },
    [['Severe', 0.01, 24, 'No']]),
  x(62, 'Ankle Fracture', ALL, 'Ankle', 'Bony bumps on either side of the ankle; hard to put weight on', 'YYSYS',
    { contact: 'either', major: true, flags: { deformity: 'S', nerve: 'S', wound: 'S' }, mech: ['contact', 'landing', 'slide', 'fall', 'jump'] },
    [['Moderate', 0.05, 6, 'No'], ['Severe', 0.05, 12, 'No']]),
  x(63, 'Foot Fracture (Metatarsal)', ALL, 'Foot', 'Top or outer edge of the foot', 'YYNYS',
    { contact: 'either', major: true, mech: ['contact', 'landing', 'cutting', 'kick'] },
    [['Moderate', 0.05, 6, 'No'], ['Severe', 0.05, 10, 'No']]),
  x(55, 'Foot Stress Fracture', ['Basketball', 'Football', 'Soccer'], 'Foot', 'Top or middle of the foot, aching with activity', 'SNNYN',
    { contact: 'noncontact', major: true, mech: ['sprint', 'jump', 'landing'] },
    [['Moderate', 0.05, 8, 'No'], ['Severe', 0.05, 26, 'No']]),
  x(74, 'Achilles Tendon Rupture', ['Baseball'], 'Achilles Tendon', 'Back of the ankle/lower calf', 'YYYYY',
    { contact: 'noncontact', major: true, mech: ['sprint', 'throw', 'cutting'] },
    [['Severe', 0.01, 52, 'No']]),
  x(73, 'Turf Toe (Big Toe Sprain)', ['Baseball', 'Basketball'], 'Big Toe', 'Base of the big toe', 'YSYYN',
    { contact: 'either', mech: ['sprint', 'cutting', 'contact', 'slide'] },
    [['Mild', 0.03, 2, 'Yes'], ['Moderate', 0.03, 6, 'No']]),

  // shoulder and arm
  x(68, 'Shoulder Dislocation / Subluxation', ['Baseball', 'Basketball'], 'Shoulder', 'Front or outer shoulder; may slip out and back in', 'YNYYS',
    { contact: 'either', major: true, flags: { deformity: 'S', nerve: 'S' }, mech: ['slide', 'dive', 'fall', 'contact', 'swing', 'throw'] },
    [['Moderate', 0.05, 4, 'No'], ['Severe', 0.05, 12, 'No']]),
  x(69, 'Labral Tear - Shoulder', ['Football', 'Basketball', 'Soccer'], 'Shoulder', 'Deep in the shoulder joint, catching sensation', 'SNYYS',
    { contact: 'either', mech: ['throw', 'contact', 'fall', 'dive'] },
    [['Moderate', 0.04, 16, 'No'], ['Severe', 0.04, 40, 'No']]),
  x(70, 'Rotator Cuff Tear', ['Football'], 'Shoulder', 'Front/side of shoulder, may radiate down arm', 'NSYYN',
    { contact: 'either', major: true, mech: ['throw', 'contact', 'fall'] },
    [['Moderate', 0.02, 12, 'No'], ['Severe', 0.02, 24, 'No']]),
  x(75, 'Upper Arm Fracture (Humerus)', ALL, 'Upper Arm', 'Middle of the upper arm', 'YYYYS',
    { contact: 'either', major: true, flags: { deformity: 'Y', nerve: 'S' }, mech: ['throw', 'contact', 'fall'] },
    [['Severe', 0.005, 16, 'No']]),

  // hand
  x(54, 'Hand Fracture (Metacarpal)', ALL, 'Hand', 'Back or side of the hand, over the broken bone', 'YYSYN',
    { contact: 'contact', major: true, mech: ['fall', 'contact', 'hit_by_ball', 'dive', 'slide'] },
    [['Moderate', 0.10, 6, 'No'], ['Severe', 0.10, 12, 'No']]),
  x(71, 'Thumb Ligament Tear', ALL, 'Thumb', 'Inner side of the thumb, at its base', 'YSYYN',
    { contact: 'contact', mech: ['slide', 'fall', 'dive', 'contact'] },
    [['Moderate', 0.03, 6, 'No']]),
  x(72, 'Finger or Thumb Fracture', ['Baseball', 'Football', 'Soccer'], 'Finger Joint', 'Over the broken bone in the finger or thumb', 'YYNYS',
    { contact: 'contact', major: true, mech: ['hit_by_ball', 'contact', 'fall', 'dive', 'slide'] },
    [['Moderate', 0.05, 6, 'No']]),

  // back
  x(59, 'Vertebra (Back Bone) Fracture', ALL, 'Lower Back', 'Over the spine, sharp and worse with movement', 'SSSYN',
    { contact: 'contact', major: true, flags: { nerve: 'S' }, mech: ['contact', 'fall', 'jump', 'landing', 'dive'] },
    [['Moderate', 0.01, 8, 'No'], ['Severe', 0.01, 12, 'No']]),
  x(77, 'Lower Back Strain', ['Football', 'Soccer'], 'Lower Back', 'Lower back, sometimes into the hip', 'NNNYN',
    { contact: 'either', mech: ['contact', 'jump', 'landing', 'kick', 'fall'] },
    [['Mild', 0.15, 2, 'Yes'], ['Moderate', 0.15, 5, 'No']]),

  // emergencies (extreme injuries)
  x(57, 'Cardiac Arrest (Sudden Collapse)', ALL, 'Heart', 'Sudden collapse; may not be breathing normally', 'NNNNN',
    { contact: 'either', major: true, flags: { collapse: 'Y', loc: 'S' }, mech: ['sprint', 'contact'] },
    [['Severe', 0.005, 26, 'No']]),
  x(58, 'Spinal Cord or Neck Injury', ALL, 'Spine', "Neck or back; numbness, weakness, or can't move arms or legs", 'SNSYN',
    { contact: 'contact', major: true, flags: { nerve: 'Y', loc: 'S', deformity: 'S' }, mech: ['contact', 'dive', 'fall', 'header', 'slide'] },
    [['Severe', 0.005, 52, 'No']]),
  x(60, 'Skull Fracture or Bleeding Around the Brain', ALL, 'Head', 'Where the head was hit; can get worse over hours', 'YSNNN',
    { contact: 'contact', major: true, flags: { loc: 'Y', wound: 'S', deformity: 'S' }, mech: ['contact', 'hit_by_ball', 'header', 'fall', 'dive'] },
    [['Severe', 0.005, 12, 'No']]),
  x(61, 'Facial or Eye-Socket Fracture', ALL, 'Face', 'Cheekbone, jaw, nose, or around the eye', 'YYNSN',
    { contact: 'contact', major: true, flags: { loc: 'S', wound: 'S', deformity: 'S' }, mech: ['hit_by_ball', 'contact', 'header', 'fall'] },
    [['Moderate', 0.02, 6, 'No'], ['Severe', 0.02, 12, 'No']]),
];

/* Profiles for injuries already in the team's database, keyed by lowercase name. */
const BASE_PROFILES = {
  'ankle sprain': { contact: 'either' },
  'acl tear': ACL_PROFILE,
  'meniscus tear': { contact: 'either' },
  'knee injury - meniscus': { contact: 'either' },
  "patellar tendinitis - jumper's knee": { contact: 'noncontact', body_part: 'Kneecap' },
  'knee injury - patellar': { contact: 'either', body_part: 'Kneecap' },
  'achilles tendon rupture': { contact: 'noncontact', major: true },
  'achilles tear': { contact: 'noncontact', major: true },
  'finger sprain': { contact: 'contact' },
  'finger fracture': { contact: 'contact', major: true },
  'hamstring strain': { contact: 'noncontact', body_part: 'Hamstring' },
  'lower back strain / spondylolysis': { contact: 'noncontact' },
  // The database's "instability: Yes" for concussion means dizziness or poor balance, but the app's
  // instability question asks about a joint giving way, so it is treated as "Sometimes" here.
  'concussion': { contact: 'contact', major: true, flags: { loc: 'Y' }, instability: 'Sometimes' },
  'wrist fracture': { contact: 'either', major: true, flags: { deformity: 'S' } },
  'rotator cuff strain': { contact: 'noncontact' },
  'rotator cuff tear': { contact: 'either', major: true },
  'ucl sprain': { contact: 'noncontact' },
  'ucl tear': { contact: 'noncontact', major: true },
  'oblique strain': { contact: 'noncontact' },
  'hand contusion': { contact: 'contact' },
  'mcl sprain': { contact: 'contact' },
  'mcl tear': { contact: 'contact' },
  'shoulder dislocation': { contact: 'either', major: true, flags: { deformity: 'S', nerve: 'S' } },
  'rib fracture': { contact: 'contact' },
  'achilles tendonitis': { contact: 'noncontact' },
  'groin strain': { contact: 'noncontact' },
  'shin splint': { contact: 'noncontact' },
  'calf strain': { contact: 'noncontact' },
};

const RENAME = {
  'Knee Injury - Meniscus': 'Meniscus Tear',
  'Knee Injury - Patellar': 'Kneecap Pain (Patellofemoral)',
  'Achilles Tear': 'Achilles Tendon Rupture',
  'Shoulder Dislocation': 'Shoulder Dislocation / Subluxation',
  'Turf Toe': 'Turf Toe (Big Toe Sprain)',
  'MCL Sprain': 'MCL Sprain or Tear',
  'MCL Tear': 'MCL Sprain or Tear',
  'Shin Splint': 'Shin Splints',
};

/* Moves added for gaps in the test sheet. */
const EXTRA_MOVES = [
  { move_id: 31, sport: 'Football', move_name: 'Throwing a Pass', move_description: 'Passing motion, often while being hit or pressured' },
  { move_id: 32, sport: 'Football', move_name: 'Being Tackled or Hit', move_description: 'Taking a hit while carrying, throwing, or catching the ball' },
  { move_id: 33, sport: 'Soccer', move_name: 'Challenge or Collision', move_description: 'Tackled, fouled, or colliding with another player' },
  { move_id: 34, sport: 'Baseball', move_name: 'Chasing a Fly Ball', move_description: 'Tracking a fly ball in the outfield, sometimes into the wall' },
];

// [move_id, injury_id] links for injuries in the team's database
const EXTRA_MOVE_LINKS = [
  [4, 1],            // ankle sprain from cutting / defensive slides
  [1, 5], [4, 5],    // Achilles rupture on push-off while driving or cutting
  [4, 3],            // meniscus tear from planting and pivoting
  [17, 31],          // MCL from a hit
  [32, 27], [32, 28], [32, 29], [32, 31], [32, 32], [32, 35], [32, 36],
  [33, 37], [33, 40], [33, 41], [33, 42], [33, 48],
  [34, 19], [34, 20], [34, 24],
];

/* What kind of movement each move is. Used to link moves to the provisional injuries above. */
const MOVE_TAGS = {
  1: ['cutting', 'sprint'], 2: ['jump'], 3: ['landing', 'jump'], 4: ['cutting'], 5: ['contact'],
  6: ['jump', 'contact'], 7: ['fall', 'contact'], 8: ['sprint'],
  9: ['throw'], 10: ['swing'], 11: ['sprint'], 12: ['slide'], 13: ['cutting', 'throw'], 14: ['squat'],
  15: ['dive', 'fall', 'contact'], 16: ['hit_by_ball'],
  17: ['contact'], 18: ['cutting'], 19: ['sprint'], 20: ['contact'], 21: ['landing', 'jump'],
  22: ['sprint'], 23: ['kick'], 24: ['kick'], 25: ['cutting'], 26: ['cutting'], 27: ['header', 'contact'],
  28: ['jump', 'landing'], 29: ['slide', 'contact'], 30: ['dive', 'fall'],
  31: ['throw'], 32: ['contact'], 33: ['contact'], 34: ['sprint', 'cutting'],
};

const sev = (id, sevName, frequency, weeks, canPlay, injuryId) => ({
  severity_id: id, severity: sevName, frequency, recovery_time_avg: weeks,
  can_continue_playing: canPlay, injury_id: injuryId,
});

const withDefaults = p => ({ contact: 'either', major: false, flags: {}, mech: [], ...p });

export const DB = (() => {
  const injuries = BASE_DB.injuries.map(i => {
    const p = BASE_PROFILES[i.injury_name.toLowerCase()] || {};
    return {
      ...i,
      injury_name: RENAME[i.injury_name] || i.injury_name,
      body_part: p.body_part || i.body_part,
      instability: p.instability || i.instability,
      pain_location: i.pain_location.replace('b ack', 'back'),
      profile: withDefaults(p),
    };
  });
  const severities = [...BASE_DB.severities];
  EXTRA_INJURIES.forEach(e => e.sports.forEach(sport => {
    const id = e.id * 10 + SPORT_IDX[sport];
    const { id: _id, name, sports: _s, profile, severities: sevs, ...fields } = e;
    injuries.push({ injury_id: id, injury_name: name, injury_sport: sport, ...fields, profile: withDefaults(profile) });
    sevs.forEach(([s, f, w, c]) => severities.push(sev(`${id}${s.slice(0, 2)}`, s, f, w, c, id)));
  }));

  const moveInjury = [...BASE_DB.moveInjury];
  const seen = new Set(moveInjury.map(mi => `${mi.move_id}:${mi.injury_id}`));
  EXTRA_MOVE_LINKS.forEach(([m, i]) => {
    if (!seen.has(`${m}:${i}`)) { moveInjury.push({ move_id: m, injury_id: i }); seen.add(`${m}:${i}`); }
  });
  return { injuries, severities, moves: [...BASE_DB.moves, ...EXTRA_MOVES], moveInjury };
})();

export const SYMPTOM_FIELDS = [
  { key: 'swelling', label: 'Swelling', hint: 'Puffiness or fluid buildup around the area' },
  { key: 'bruising', label: 'Bruising', hint: 'Discoloration under the skin' },
  { key: 'instability', label: 'Instability', hint: 'Feels like it could give out or shift' },
  { key: 'limited_range_of_motion', label: 'Limited motion', hint: "Can't move it through its full range" },
  { key: 'audible_pop', label: 'Audible pop', hint: 'Heard or felt a pop or snap at the moment of injury' },
];

export const CONTACT_OPTIONS = [
  { key: 'player', label: 'Yes, with another player' },
  { key: 'object', label: 'Yes, with the ball, ground, wall, or equipment' },
  { key: 'none', label: 'No contact' },
  { key: 'unsure', label: 'Not sure' },
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
  { id: 'head', label: 'Head', group: 'Head and neck', db: { Head: 1, Face: 0.3 },
    words: /\bhead\b|skull|concussion|brain|forehead|temple/ },
  { id: 'face', label: 'Face, jaw, or eye', group: 'Head and neck', db: { Face: 1, Head: 0.4 },
    words: /\bface\b|\bfacial\b|\bjaw\b|cheek|\beyes?\b|orbit|\bnose\b|teeth|tooth/ },
  { id: 'neck', label: 'Neck', group: 'Head and neck', db: { Spine: 1, Head: 0.3 },
    words: /\bneck\b|cervical|whiplash/ },

  { id: 'shoulder', label: 'Shoulder', group: 'Shoulder and arm', db: { Shoulder: 1, Chest: 0.2 },
    words: /shoulder(?! blade)|collarbone|clavicle|rotator|\bac joint\b|labrum/ },
  { id: 'upper_arm', label: 'Upper arm', group: 'Shoulder and arm', db: { 'Upper Arm': 1, Shoulder: 0.4, Elbow: 0.4 },
    words: /\bbicep|\btricep|upper arm|\barm\b|humerus/ },
  { id: 'elbow', label: 'Elbow', group: 'Shoulder and arm', db: { Elbow: 1 },
    words: /elbow|\bucl\b/ },
  { id: 'forearm', label: 'Forearm', group: 'Shoulder and arm', db: { Elbow: 0.4, Wrist: 0.4 },
    words: /forearm/ },
  { id: 'wrist', label: 'Wrist', group: 'Shoulder and arm', db: { Wrist: 1, Hand: 0.4 },
    words: /wrist/ },
  { id: 'hand', label: 'Hand', group: 'Shoulder and arm', db: { Hand: 1, 'Finger Joint': 0.5, Thumb: 0.5, Wrist: 0.5 },
    words: /\bhand\b|palm|knuckle|metacarpal/ },
  { id: 'fingers', label: 'Fingers or thumb', group: 'Shoulder and arm', db: { 'Finger Joint': 1, Thumb: 1, Hand: 0.5 },
    words: /finger|thumb|\bpinky\b/ },

  { id: 'chest', label: 'Chest, ribs, or heart', group: 'Torso', db: { Chest: 1, Heart: 1, Torso: 0.4 },
    words: /\bchest\b|\bribs?\b|ribcage|sternum|\bpecs?\b|\bheart\b|cardiac/ },
  { id: 'side', label: 'Side or abdomen', group: 'Torso', db: { Torso: 1, Chest: 0.4, 'Lower Back': 0.3 },
    words: /abdomen|abdominal|\babs\b|oblique|stomach|\bcore\b|torso|\bflank\b/ },
  { id: 'upper_back', label: 'Upper back', group: 'Torso', db: { Torso: 0.4, 'Lower Back': 0.4, Shoulder: 0.3, Spine: 0.8 },
    words: /upper back|\bmid(dle)? back|shoulder blade|scapula|thoracic/ },
  { id: 'lower_back', label: 'Lower back or spine', group: 'Torso', db: { 'Lower Back': 1, Torso: 0.3, Spine: 0.8 },
    words: /low(er)? back|lumbar|\bspine\b|vertebra|\bback\b/ },

  { id: 'hip_groin', label: 'Hip or groin', group: 'Hip and thigh', db: { Groin: 1, Hamstring: 0.3, Thigh: 0.5 },
    words: /\bhip\b|groin|pelvi|glute|buttock|\bbutt\b/ },
  { id: 'quad', label: 'Front of thigh (quad)', group: 'Hip and thigh', db: { Thigh: 1, Hamstring: 0.5, Knee: 0.3, Kneecap: 0.3 },
    hint: /front of (the )?thigh|quad/i, words: /\bquad(s|riceps)?\b|front of (the |my )?thigh/ },
  { id: 'hamstring', label: 'Back of thigh (hamstring)', group: 'Hip and thigh', db: { Hamstring: 1, Thigh: 0.6 },
    hint: /back of (the )?thigh|hamstring/i, words: /\bhamstrings?\b|back of (the |my )?thigh/ },

  { id: 'knee', label: 'Knee', group: 'Knee', db: { Knee: 1, Kneecap: 0.5, Thigh: 0.2 },
    words: /\bknee(?!cap)|\bacl\b|\bpcl\b|\bmcl\b|\blcl\b|meniscus|\bit band\b/ },
  { id: 'kneecap', label: 'Kneecap (front of knee)', group: 'Knee', db: { Kneecap: 1, Knee: 0.5 },
    words: /kneecap|patell/ },

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
  if (found.has('lower_back') && !/low(er)? back|lumbar|\bspine\b|vertebra/.test(t)) {
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
  34: /fly ball|\boutfield|\bwall\b|\bfence\b|\bgate\b/,
  // Football
  17: /\btackl(e|ed|ing)\b|\bcollid|\bcollision\b|\bhit\b|\bsack(ed)?\b|\bpiled\b/,
  18: /\bcut(s|ting)?\b|chang(e|ing) (of )?direction|\bpivot|\bplant|\bjuke|\bsidestep/,
  19: /\bsprint|explosive|accelerat|\bran\b|\brunn?ing\b|burst/,
  20: /\bblock(ed|ing)?\b|absorb|\bcontact\b|\bbrac(e|ed|ing)\b|\bpush(ed|ing)?\b/,
  21: /\bland(s|ed|ing)?\b|\bjump(ed|ing)?\b|came down/,
  31: /\bthrow(ing|n|s)?\b|\bthrew\b|\bpass(ed|ing)?\b|quarterback/,
  32: /\btackled\b|\bsacked\b|got hit|\bwas hit\b|\bhit low\b|low hit/,
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
  33: /\btackled\b|\bfoul(ed)?\b|\bchalleng|\bcollid|\bcollision|\bclash/,
};

export function movesForSport(sport) {
  const injuryIds = new Set(DB.injuries.filter(i => i.injury_sport === sport).map(i => i.injury_id));
  const moveIds = new Set(DB.moveInjury.filter(mi => injuryIds.has(mi.injury_id)).map(mi => mi.move_id));
  return DB.moves.filter(m => (m.sport ? m.sport === sport : moveIds.has(m.move_id)));
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
const RED_FLAG_KEYS = ['deformity', 'nerve', 'wound', 'loc', 'collapse'];
const FLAG_REASON = {
  deformity: 'Fits the visible deformity you reported',
  nerve: 'Fits the numbness or color change you reported',
  wound: 'Fits the open wound you reported',
  loc: 'Fits the head hit with blackout or confusion',
  collapse: 'Fits a sudden collapse',
};

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

function scoreOne(inj, areas, ctx) {
  let score = 0;
  const reasons = [];
  const p = inj.profile;

  if (areas.length > 0) {
    const body = bodyMatch(inj, areas);
    score += 8 * body.weight;
    reasons.push(body.weight >= 1 ? 'Same body part' : 'Close to where it hurts');
    if (body.hint) score += 2;
  }

  // Safety-check answers. A "yes" points toward injuries that usually cause it.
  RED_FLAG_KEYS.forEach(k => {
    const ans = ctx.redFlags[k];
    const v = p.flags[k];
    if (ans === 'yes') {
      if (v === 'Y') { score += 5; reasons.unshift(FLAG_REASON[k]); }
      else if (v === 'S') score += 1.5;
      else score -= 2;
    } else if (ans === 'no' && v === 'Y') {
      score -= 3;
    }
  });

  const linked = ctx.moveIds.filter(m =>
    ctx.links.has(`${m}:${inj.injury_id}`) || (MOVE_TAGS[m] || []).some(t => p.mech.includes(t)),
  ).length;
  if (linked > 0) {
    score += 3 + Math.min(linked - 1, 2);
    reasons.push('Matches how this usually happens');
  }

  if (ctx.contact === 'player' || ctx.contact === 'object') {
    if (p.contact === 'contact') { score += 2; reasons.push('Usually caused by contact, like yours'); }
    else if (p.contact === 'noncontact') score -= 2.5;
  } else if (ctx.contact === 'none') {
    if (p.contact === 'noncontact') { score += 2; reasons.push('Often happens without contact, like yours'); }
    else if (p.contact === 'contact') score -= 3;
  }

  if (ctx.weightBearing === 'no' && p.major) score += 1.5;
  if (ctx.weightBearing === 'yes' && p.major) score -= 2;

  SYMPTOM_FIELDS.forEach(({ key, label }) => {
    const ans = ctx.symptoms[key];
    if (!ans || ans === 'unsure') return;
    const v = inj[key];
    const w = key === 'audible_pop' ? 3 : 2;
    if (v === 'Sometimes') {
      score += 0.5;
    } else if ((v === 'Yes' && ans === 'yes') || (v === 'No' && ans === 'no')) {
      score += w;
      reasons.push(ans === 'yes' ? `Reported ${label.toLowerCase()} fits this injury` : `No ${label.toLowerCase()} also fits`);
    } else {
      score -= w;
    }
  });

  score += Math.min(1.5, 1.5 * Math.sqrt(frequencyOf(inj.injury_id)));

  return { ...inj, score, reasons, severity: estimateSeverity(inj.injury_id, ctx.symptoms) };
}

function rank(candidates, areas, ctx, limit) {
  return candidates
    .filter(inj => areas.length === 0 || bodyMatch(inj, areas).weight > 0)
    .map(inj => scoreOne(inj, areas, ctx))
    .sort((a, b) => b.score - a.score || frequencyOf(b.injury_id) - frequencyOf(a.injury_id))
    .filter(r => r.score > 0)
    .slice(0, limit);
}

/* Injuries in the same spot that commonly happen together. */
const TOGETHER = [
  ['acl', 'mcl'], ['acl', 'lcl'], ['acl', 'meniscus'],
  ['shoulder dislocation', 'labral'], ['labral', 'rotator cuff'],
  ['ankle fracture', 'ankle sprain'], ['tibia', 'ankle fracture'],
];
function oftenTogether(a, b) {
  const x = a.injury_name.toLowerCase();
  const y = b.injury_name.toLowerCase();
  return TOGETHER.some(([p, q]) => (x.includes(p) && y.includes(q)) || (x.includes(q) && y.includes(p)));
}

function ctxFrom({ sport, moveIds = [], symptoms = {}, contact = null, redFlags = {}, weightBearing = null }) {
  return {
    sport, moveIds, symptoms, contact, redFlags, weightBearing,
    links: new Set(DB.moveInjury.map(mi => `${mi.move_id}:${mi.injury_id}`)),
  };
}

/**
 * Flat ranking across everything selected (kept for older callers).
 */
export function scoreInjuries({ sport, areaIds = [], limit = 4, ...rest }) {
  const candidates = DB.injuries.filter(i => i.injury_sport === sport);
  const areas = BODY_AREAS.filter(a => areaIds.includes(a.id));
  return rank(candidates, areas, ctxFrom({ sport, ...rest }), limit);
}

/**
 * Rank injuries separately for each part of the body that was picked, so
 * someone with a hamstring AND a knee problem sees both instead of one list
 * that implies a single injury. Within one area, a runner-up that often
 * happens together with the top match (ACL + MCL, say) is marked `together`.
 * A "yes" to the collapse question always adds a separate cardiac group.
 */
export function analyze({ sport, areaIds = [], perGroup = 3, ...rest }) {
  const ctx = ctxFrom({ sport, ...rest });
  const candidates = DB.injuries.filter(i => i.injury_sport === sport);
  const areas = BODY_AREAS.filter(a => areaIds.includes(a.id));
  const groups = [];

  if (ctx.redFlags.collapse === 'yes') {
    const matches = rank(candidates.filter(i => i.profile.flags.collapse === 'Y'), [], ctx, 1);
    if (matches.length) groups.push({ key: 'collapse', label: 'Sudden collapse', areaLabels: [], matches });
  }
  const shown = new Set(groups.flatMap(g => g.matches.map(m => m.injury_id)));

  const regionGroups = areas.length
    ? BODY_GROUPS.map(g => ({ key: g, label: g, areas: areas.filter(a => a.group === g) })).filter(g => g.areas.length)
    : [{ key: 'all', label: 'Overall', areas: [] }];

  const regional = regionGroups.map(g => {
    const matches = rank(candidates.filter(i => !shown.has(i.injury_id)), g.areas, ctx, perGroup);
    const top = matches[0];
    const flagged = [top];
    matches.forEach((m, i) => {
      m.together = i > 0 && m.score >= 0.5 * top.score && flagged.some(f => oftenTogether(f, m));
      if (m.together) flagged.push(m);
      m.close = i > 0 && !m.together && m.score >= 0.9 * top.score;
    });
    return { key: g.key, label: g.label, areaLabels: g.areas.map(a => a.label), matches };
  }).filter(g => g.matches.length);

  regional.sort((a, b) => b.matches[0].score - a.matches[0].score);
  groups.push(...regional);
  return { groups, topMatches: groups.map(g => g.matches[0]) };
}

/** Urgency comes from the safety check, weight-bearing, and the worst top match across all areas. */
export function decideTier({ redFlags, weightBearing, topMatch, topMatches }) {
  if (Object.values(redFlags).some(v => v === 'yes')) return 'emergency';
  if (weightBearing !== 'yes') return 'urgent'; // 'no' or 'unsure' both default to caution
  const tops = (topMatches || [topMatch]).filter(m => m && m.severity);
  if (!tops.length) return 'clinician';
  const worst = Math.max(...tops.map(m => SEVERITY_ORDER.indexOf(m.severity.severity)));
  if (worst === 2) return 'urgent';
  if (worst === 1) return 'clinician';
  return 'selfcare';
}
