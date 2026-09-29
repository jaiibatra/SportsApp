import React, { useState, useMemo } from 'react';
import {
  Activity, AlertTriangle, ArrowLeft, ArrowRight, Check, ChevronRight,
  ClipboardList, History, ShieldAlert, Stethoscope, User, Zap, HeartPulse,
  CircleCheck, RotateCcw, Info
} from 'lucide-react';

/* ---------------------------------------------------------------
   DATA — parsed from the team's INJURY_GENERAL / INJURY_SEVERITY /
   MOVE / MOVE_INJURY tables (Vegas project, HW1 dataset)
--------------------------------------------------------------- */
const DB = {"injuries":[{"injury_id":1,"injury_name":"Ankle Sprain","injury_sport":"Basketball","body_part":"Ankle","pain_location":"Around the ankle joint, most often lateral (outside)","swelling":"Yes","bruising":"Yes","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Sometimes"},{"injury_id":2,"injury_name":"ACL Tear","injury_sport":"Basketball","body_part":"Knee","pain_location":"Deep in the knee, sometimes diffuse","swelling":"Yes","bruising":"No","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Yes"},{"injury_id":3,"injury_name":"Meniscus Tear","injury_sport":"Basketball","body_part":"Knee","pain_location":"Joint line of the knee (inner or outer)","swelling":"Yes","bruising":"No","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Sometimes"},{"injury_id":4,"injury_name":"Patellar Tendinitis - Jumper's Knee","injury_sport":"Basketball","body_part":"Knee","pain_location":"Just below the kneecap, at the patellar tendon","swelling":"No","bruising":"No","instability":"No","limited_range_of_motion":"Yes","audible_pop":"No"},{"injury_id":5,"injury_name":"Achilles Tendon Rupture","injury_sport":"Basketball","body_part":"Lower Calf","pain_location":"Back of the ankle/lower calf","swelling":"Yes","bruising":"Yes","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Yes"},{"injury_id":6,"injury_name":"Finger Sprain","injury_sport":"Basketball","body_part":"Finger Joint","pain_location":"Localized to the affected finger joint","swelling":"Yes","bruising":"Yes","instability":"No","limited_range_of_motion":"Yes","audible_pop":"No"},{"injury_id":7,"injury_name":"Finger Fracture","injury_sport":"Basketball","body_part":"Finger Joint","pain_location":"Localized to the affected finger joint","swelling":"Yes","bruising":"Yes","instability":"Sometimes","limited_range_of_motion":"Yes","audible_pop":"No"},{"injury_id":8,"injury_name":"Hamstring Strain","injury_sport":"Basketball","body_part":"Hamstring","pain_location":"Back of the thigh, sudden and sharp mid-sprint","swelling":"Sometimes","bruising":"Yes","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Sometimes"},{"injury_id":9,"injury_name":"Lower Back Strain","injury_sport":"Basketball","body_part":"Lower Back","pain_location":"Lower b ack, sometimes radiating to hip","swelling":"No","bruising":"No","instability":"No","limited_range_of_motion":"Yes","audible_pop":"No"},{"injury_id":10,"injury_name":"Concussion","injury_sport":"Basketball","body_part":"Head","pain_location":"Head/neck, may include headache","swelling":"Sometimes","bruising":"Sometimes","instability":"Yes","limited_range_of_motion":"No","audible_pop":"No"},{"injury_id":11,"injury_name":"Wrist Sprain","injury_sport":"Basketball","body_part":"Wrist","pain_location":"Localized to the wrist, sometimes radiating into the hand","swelling":"Yes","bruising":"Yes","instability":"No","limited_range_of_motion":"Yes","audible_pop":"No"},{"injury_id":12,"injury_name":"Wrist Fracture","injury_sport":"Basketball","body_part":"Wrist","pain_location":"Localized to the wrist, sometimes radiating into the hand","swelling":"Yes","bruising":"Yes","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"No"},{"injury_id":13,"injury_name":"Rotator Cuff Strain","injury_sport":"Baseball","body_part":"Shoulder","pain_location":"Front/side of shoulder, may radiate down arm","swelling":"No","bruising":"No","instability":"No","limited_range_of_motion":"Yes","audible_pop":"No"},{"injury_id":14,"injury_name":"Rotator Cuff Tear","injury_sport":"Baseball","body_part":"Shoulder","pain_location":"Front/side of shoulder, may radiate down arm","swelling":"No","bruising":"Sometimes","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"No"},{"injury_id":15,"injury_name":"UCL Sprain","injury_sport":"Baseball","body_part":"Elbow","pain_location":"Inner (medial) elbow","swelling":"No","bruising":"No","instability":"Yes","limited_range_of_motion":"No","audible_pop":"No"},{"injury_id":16,"injury_name":"UCL Tear","injury_sport":"Baseball","body_part":"Elbow","pain_location":"Inner (medial) elbow","swelling":"No","bruising":"Sometimes","instability":"Yes","limited_range_of_motion":"No","audible_pop":"Yes"},{"injury_id":17,"injury_name":"Labral Tear - Shoulder","injury_sport":"Baseball","body_part":"Shoulder","pain_location":"Deep in shoulder joint, catching sensation","swelling":"No","bruising":"No","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Sometimes"},{"injury_id":18,"injury_name":"Oblique Strain","injury_sport":"Baseball","body_part":"Torso","pain_location":"Side of torso/ribcage, sharp and localized","swelling":"No","bruising":"Sometimes","instability":"No","limited_range_of_motion":"Yes","audible_pop":"No"},{"injury_id":19,"injury_name":"Hamstring Strain","injury_sport":"Baseball","body_part":"Hamstring","pain_location":"Back of thigh, sudden/sharp mid-sprint","swelling":"Sometimes","bruising":"Yes","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Sometimes"},{"injury_id":20,"injury_name":"Ankle Sprain","injury_sport":"Baseball","body_part":"Ankle","pain_location":"Around ankle joint, lateral side most common","swelling":"Yes","bruising":"Yes","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Sometimes"},{"injury_id":21,"injury_name":"Concussion","injury_sport":"Baseball","body_part":"Head","pain_location":"Head/neck, possible headache","swelling":"Sometimes","bruising":"Sometimes","instability":"Yes","limited_range_of_motion":"No","audible_pop":"No"},{"injury_id":22,"injury_name":"Hand Contusion","injury_sport":"Baseball","body_part":"Hand","pain_location":"Localized to impact point","swelling":"Yes","bruising":"Yes","instability":"No","limited_range_of_motion":"Yes","audible_pop":"No"},{"injury_id":23,"injury_name":"Wrist Fracture","injury_sport":"Baseball","body_part":"Wrist","pain_location":"Localized to impact point","swelling":"Yes","bruising":"Yes","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"No"},{"injury_id":24,"injury_name":"Knee Injury - Meniscus","injury_sport":"Baseball","body_part":"Knee","pain_location":"Around/behind kneecap, or joint line","swelling":"Yes","bruising":"No","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Sometimes"},{"injury_id":25,"injury_name":"Knee Injury - Patellar","injury_sport":"Baseball","body_part":"Knee","pain_location":"Around/behind kneecap, or joint line","swelling":"Yes","bruising":"No","instability":"No","limited_range_of_motion":"Yes","audible_pop":"No"},{"injury_id":26,"injury_name":"Lower Back Strain / Spondylolysis","injury_sport":"Baseball","body_part":"Lower Back","pain_location":"Lower back, may radiate to hip/buttock","swelling":"No","bruising":"No","instability":"No","limited_range_of_motion":"Yes","audible_pop":"No"},{"injury_id":27,"injury_name":"ACL Tear","injury_sport":"Football","body_part":"Knee","pain_location":"Deep in the knee joint","swelling":"Yes","bruising":"No","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Yes"},{"injury_id":28,"injury_name":"Concussion","injury_sport":"Football","body_part":"Head","pain_location":"Generalized headache or pressure in the head","swelling":"No","bruising":"No","instability":"Yes","limited_range_of_motion":"No","audible_pop":"No"},{"injury_id":29,"injury_name":"Ankle Sprain","injury_sport":"Football","body_part":"Ankle","pain_location":"Above the ankle joint, between the tibia and fibula","swelling":"Yes","bruising":"Yes","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Sometimes"},{"injury_id":30,"injury_name":"Hamstring Strain","injury_sport":"Football","body_part":"Hamstring","pain_location":"Back of the thigh","swelling":"Sometimes","bruising":"Yes","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Sometimes"},{"injury_id":31,"injury_name":"MCL Sprain","injury_sport":"Football","body_part":"Knee","pain_location":"Inner side of knee","swelling":"Yes","bruising":"Sometimes","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Sometimes"},{"injury_id":32,"injury_name":"Shoulder Dislocation","injury_sport":"Football","body_part":"Shoulder","pain_location":"Outer shoulder/deltoid area","swelling":"Yes","bruising":"No","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Yes"},{"injury_id":33,"injury_name":"Turf Toe","injury_sport":"Football","body_part":"Big Toe","pain_location":"Base of big toe","swelling":"Yes","bruising":"Sometimes","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Sometimes"},{"injury_id":34,"injury_name":"Achilles Tear","injury_sport":"Football","body_part":"Achilles Tendon","pain_location":"Back of ankle/heel","swelling":"Yes","bruising":"Yes","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Yes"},{"injury_id":35,"injury_name":"Rib Fracture","injury_sport":"Football","body_part":"Chest","pain_location":"Side or front of chest","swelling":"Sometimes","bruising":"Sometimes","instability":"No","limited_range_of_motion":"Yes","audible_pop":"Sometimes"},{"injury_id":36,"injury_name":"Meniscus Tear","injury_sport":"Football","body_part":"Knee","pain_location":"Inside or outside of knee","swelling":"Yes","bruising":"Sometimes","instability":"Sometimes","limited_range_of_motion":"Yes","audible_pop":"Sometimes"},{"injury_id":37,"injury_name":"Ankle Sprain","injury_sport":"Soccer","body_part":"Ankle","pain_location":"Outside of ankle","swelling":"Yes","bruising":"Yes","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Sometimes"},{"injury_id":38,"injury_name":"Achilles Tendonitis","injury_sport":"Soccer","body_part":"Achilles Tendon","pain_location":"Back of Ankle","swelling":"Sometimes","bruising":"No","instability":"No","limited_range_of_motion":"Sometimes","audible_pop":"No"},{"injury_id":39,"injury_name":"Achilles Tendon Rupture","injury_sport":"Soccer","body_part":"Calf","pain_location":"Lower calf","swelling":"Yes","bruising":"Sometimes","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Yes"},{"injury_id":40,"injury_name":"ACL Tear","injury_sport":"Soccer","body_part":"Knee","pain_location":"Deep inside of knee","swelling":"Yes","bruising":"Sometimes","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Yes"},{"injury_id":41,"injury_name":"MCL Tear","injury_sport":"Soccer","body_part":"Knee","pain_location":"Inner side of knee","swelling":"Yes","bruising":"Sometimes","instability":"Yes","limited_range_of_motion":"Sometimes","audible_pop":"Sometimes"},{"injury_id":42,"injury_name":"Concussion","injury_sport":"Soccer","body_part":"Head","pain_location":"Head","swelling":"No","bruising":"No","instability":"Sometimes","limited_range_of_motion":"No","audible_pop":"No"},{"injury_id":43,"injury_name":"Groin Strain","injury_sport":"Soccer","body_part":"Groin","pain_location":"Groin, can radiate outward to pelvic area","swelling":"Sometimes","bruising":"Sometimes","instability":"No","limited_range_of_motion":"Sometimes","audible_pop":"Sometimes"},{"injury_id":44,"injury_name":"Hamstring Strain","injury_sport":"Soccer","body_part":"Thigh","pain_location":"Back of thigh","swelling":"Sometimes","bruising":"Sometimes","instability":"No","limited_range_of_motion":"Yes","audible_pop":"Sometimes"},{"injury_id":45,"injury_name":"Shin Splint","injury_sport":"Soccer","body_part":"Shin","pain_location":"Front of shin","swelling":"No","bruising":"No","instability":"No","limited_range_of_motion":"No","audible_pop":"No"},{"injury_id":46,"injury_name":"Turf Toe","injury_sport":"Soccer","body_part":"Big Toe","pain_location":"Base of big toe","swelling":"Yes","bruising":"Sometimes","instability":"Sometimes","limited_range_of_motion":"Yes","audible_pop":"Sometimes"},{"injury_id":47,"injury_name":"Calf Strain","injury_sport":"Soccer","body_part":"Calf","pain_location":"Back of lower leg","swelling":"Sometimes","bruising":"Sometimes","instability":"No","limited_range_of_motion":"Yes","audible_pop":"Sometimes"},{"injury_id":48,"injury_name":"Shoulder Dislocation","injury_sport":"Soccer","body_part":"Shoulder","pain_location":"Outer shoulder/deltoid area","swelling":"Yes","bruising":"No","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Yes"}],"severities":[{"severity_id":"1Mi","severity":"Mild","frequency":1.47,"recovery_time_avg":2,"can_continue_playing":"Yes","injury_id":1},{"severity_id":"1Mo","severity":"Moderate","frequency":1.47,"recovery_time_avg":4,"can_continue_playing":"No","injury_id":1},{"severity_id":"1Se","severity":"Severe","frequency":1.47,"recovery_time_avg":12,"can_continue_playing":"No","injury_id":1},{"severity_id":"2Se","severity":"Severe","frequency":0.07,"recovery_time_avg":52,"can_continue_playing":"No","injury_id":2},{"severity_id":"3Mo","severity":"Moderate","frequency":0.07,"recovery_time_avg":4,"can_continue_playing":"Yes","injury_id":3},{"severity_id":"3Se","severity":"Severe","frequency":0.07,"recovery_time_avg":16,"can_continue_playing":"No","injury_id":3},{"severity_id":"4Mi","severity":"Mild","frequency":0.12,"recovery_time_avg":4,"can_continue_playing":"Yes","injury_id":4},{"severity_id":"4Mo","severity":"Moderate","frequency":0.12,"recovery_time_avg":12,"can_continue_playing":"Yes","injury_id":4},{"severity_id":"5Se","severity":"Severe","frequency":0.01,"recovery_time_avg":52,"can_continue_playing":"No","injury_id":5},{"severity_id":"6Mi","severity":"Mild","frequency":0.3,"recovery_time_avg":2,"can_continue_playing":"Yes","injury_id":6},{"severity_id":"6Mo","severity":"Moderate","frequency":0.3,"recovery_time_avg":4,"can_continue_playing":"Yes","injury_id":6},{"severity_id":"7Mo","severity":"Moderate","frequency":0.1,"recovery_time_avg":4,"can_continue_playing":"No","injury_id":7},{"severity_id":"7Se","severity":"Severe","frequency":0.1,"recovery_time_avg":6,"can_continue_playing":"No","injury_id":7},{"severity_id":"8Mi","severity":"Mild","frequency":0.18,"recovery_time_avg":3,"can_continue_playing":"No","injury_id":8},{"severity_id":"8Mo","severity":"Moderate","frequency":0.18,"recovery_time_avg":6,"can_continue_playing":"No","injury_id":8},{"severity_id":"9Mi","severity":"Mild","frequency":0.2,"recovery_time_avg":3,"can_continue_playing":"Yes","injury_id":9},{"severity_id":"9Mo","severity":"Moderate","frequency":0.2,"recovery_time_avg":6,"can_continue_playing":"No","injury_id":9},{"severity_id":"9Se","severity":"Severe","frequency":0.2,"recovery_time_avg":12,"can_continue_playing":"No","injury_id":9},{"severity_id":"10Mo","severity":"Moderate","frequency":0.34,"recovery_time_avg":3,"can_continue_playing":"No","injury_id":10},{"severity_id":"11Mi","severity":"Mild","frequency":0.15,"recovery_time_avg":1,"can_continue_playing":"Yes","injury_id":11},{"severity_id":"11Mo","severity":"Moderate","frequency":0.15,"recovery_time_avg":2,"can_continue_playing":"Yes","injury_id":11},{"severity_id":"12Mo","severity":"Moderate","frequency":0.05,"recovery_time_avg":4,"can_continue_playing":"No","injury_id":12},{"severity_id":"12Se","severity":"Severe","frequency":0.05,"recovery_time_avg":8,"can_continue_playing":"No","injury_id":12},{"severity_id":"13Mi","severity":"Mild","frequency":0.15,"recovery_time_avg":2,"can_continue_playing":"Yes","injury_id":13},{"severity_id":"13Mo","severity":"Moderate","frequency":0.15,"recovery_time_avg":6,"can_continue_playing":"Yes","injury_id":13},{"severity_id":"14Mo","severity":"Moderate","frequency":0.03,"recovery_time_avg":12,"can_continue_playing":"No","injury_id":14},{"severity_id":"14Se","severity":"Severe","frequency":0.03,"recovery_time_avg":24,"can_continue_playing":"No","injury_id":14},{"severity_id":"15Mi","severity":"Mild","frequency":0.07,"recovery_time_avg":12,"can_continue_playing":"No","injury_id":15},{"severity_id":"15Mo","severity":"Moderate","frequency":0.07,"recovery_time_avg":24,"can_continue_playing":"No","injury_id":15},{"severity_id":"16Mo","severity":"Moderate","frequency":0.04,"recovery_time_avg":52,"can_continue_playing":"No","injury_id":16},{"severity_id":"16Se","severity":"Severe","frequency":0.04,"recovery_time_avg":78,"can_continue_playing":"No","injury_id":16},{"severity_id":"17Mo","severity":"Moderate","frequency":0.08,"recovery_time_avg":16,"can_continue_playing":"No","injury_id":17},{"severity_id":"17Se","severity":"Severe","frequency":0.08,"recovery_time_avg":52,"can_continue_playing":"No","injury_id":17},{"severity_id":"18Mo","severity":"Moderate","frequency":0.05,"recovery_time_avg":4,"can_continue_playing":"No","injury_id":18},{"severity_id":"19Mi","severity":"Mild","frequency":0.25,"recovery_time_avg":1,"can_continue_playing":"Yes","injury_id":19},{"severity_id":"19Mo","severity":"Moderate","frequency":0.25,"recovery_time_avg":3,"can_continue_playing":"No","injury_id":19},{"severity_id":"19Se","severity":"Severe","frequency":0.25,"recovery_time_avg":6,"can_continue_playing":"No","injury_id":19},{"severity_id":"20Mi","severity":"Mild","frequency":0.37,"recovery_time_avg":2,"can_continue_playing":"No","injury_id":20},{"severity_id":"20Mo","severity":"Moderate","frequency":0.37,"recovery_time_avg":4,"can_continue_playing":"No","injury_id":20},{"severity_id":"20Se","severity":"Severe","frequency":0.37,"recovery_time_avg":12,"can_continue_playing":"No","injury_id":20},{"severity_id":"21Mo","severity":"Moderate","frequency":0.09,"recovery_time_avg":3,"can_continue_playing":"No","injury_id":21},{"severity_id":"22Mi","severity":"Mild","frequency":0.2,"recovery_time_avg":1,"can_continue_playing":"Yes","injury_id":22},{"severity_id":"22Mo","severity":"Moderate","frequency":0.2,"recovery_time_avg":2,"can_continue_playing":"Yes","injury_id":22},{"severity_id":"23Mo","severity":"Moderate","frequency":0.05,"recovery_time_avg":4,"can_continue_playing":"No","injury_id":23},{"severity_id":"23Se","severity":"Severe","frequency":0.05,"recovery_time_avg":8,"can_continue_playing":"No","injury_id":23},{"severity_id":"24Mi","severity":"Mild","frequency":0.03,"recovery_time_avg":2,"can_continue_playing":"Yes","injury_id":24},{"severity_id":"24Mo","severity":"Moderate","frequency":0.03,"recovery_time_avg":4,"can_continue_playing":"Yes","injury_id":24},{"severity_id":"25Mo","severity":"Moderate","frequency":0.05,"recovery_time_avg":8,"can_continue_playing":"No","injury_id":25},{"severity_id":"25Se","severity":"Severe","frequency":0.05,"recovery_time_avg":24,"can_continue_playing":"No","injury_id":25},{"severity_id":"26Mi","severity":"Mild","frequency":0.1,"recovery_time_avg":3,"can_continue_playing":"Yes","injury_id":26},{"severity_id":"26Mo","severity":"Moderate","frequency":0.1,"recovery_time_avg":8,"can_continue_playing":"No","injury_id":26},{"severity_id":"26Se","severity":"Severe","frequency":0.1,"recovery_time_avg":16,"can_continue_playing":"No","injury_id":26},{"severity_id":"27Se","severity":"Severe","frequency":0.07,"recovery_time_avg":52,"can_continue_playing":"No","injury_id":27},{"severity_id":"28Mo","severity":"Moderate","frequency":0.7,"recovery_time_avg":2,"can_continue_playing":"No","injury_id":28},{"severity_id":"29Mi","severity":"Mild","frequency":0.64,"recovery_time_avg":1,"can_continue_playing":"No","injury_id":29},{"severity_id":"29Mo","severity":"Moderate","frequency":0.64,"recovery_time_avg":6,"can_continue_playing":"No","injury_id":29},{"severity_id":"30Mi","severity":"Mild","frequency":0.44,"recovery_time_avg":2,"can_continue_playing":"No","injury_id":30},{"severity_id":"30Mo","severity":"Moderate","frequency":0.44,"recovery_time_avg":4,"can_continue_playing":"No","injury_id":30},{"severity_id":"30Se","severity":"Severe","frequency":0.44,"recovery_time_avg":8,"can_continue_playing":"No","injury_id":30},{"severity_id":"31Mi","severity":"Mild","frequency":0.2,"recovery_time_avg":3,"can_continue_playing":"Yes","injury_id":31},{"severity_id":"31Mo","severity":"Moderate","frequency":0.2,"recovery_time_avg":8,"can_continue_playing":"No","injury_id":31},{"severity_id":"32Mo","severity":"Moderate","frequency":0.15,"recovery_time_avg":4,"can_continue_playing":"No","injury_id":32},{"severity_id":"32Se","severity":"Severe","frequency":0.15,"recovery_time_avg":12,"can_continue_playing":"No","injury_id":32},{"severity_id":"33Mi","severity":"Mild","frequency":0.06,"recovery_time_avg":2,"can_continue_playing":"Yes","injury_id":33},{"severity_id":"33Mo","severity":"Moderate","frequency":0.06,"recovery_time_avg":4,"can_continue_playing":"No","injury_id":33},{"severity_id":"34Se","severity":"Severe","frequency":0.05,"recovery_time_avg":52,"can_continue_playing":"No","injury_id":34},{"severity_id":"35Mo","severity":"Moderate","frequency":0.1,"recovery_time_avg":6,"can_continue_playing":"No","injury_id":35},{"severity_id":"36Mo","severity":"Moderate","frequency":0.1,"recovery_time_avg":6,"can_continue_playing":"No","injury_id":36},{"severity_id":"36Se","severity":"Severe","frequency":0.1,"recovery_time_avg":12,"can_continue_playing":"No","injury_id":36},{"severity_id":"37Mi","severity":"Mild","frequency":0.78,"recovery_time_avg":3,"can_continue_playing":"Yes","injury_id":37},{"severity_id":"38Mo","severity":"Moderate","frequency":0.05,"recovery_time_avg":9,"can_continue_playing":"Yes","injury_id":38},{"severity_id":"39Se","severity":"Severe","frequency":0.01,"recovery_time_avg":39,"can_continue_playing":"No","injury_id":39},{"severity_id":"40Se","severity":"Severe","frequency":0.1,"recovery_time_avg":52,"can_continue_playing":"No","injury_id":40},{"severity_id":"41Mo","severity":"Moderate","frequency":0.08,"recovery_time_avg":6,"can_continue_playing":"No","injury_id":41},{"severity_id":"42Mo","severity":"Moderate","frequency":0.44,"recovery_time_avg":2,"can_continue_playing":"No","injury_id":42},{"severity_id":"43Mo","severity":"Moderate","frequency":0.45,"recovery_time_avg":4,"can_continue_playing":"No","injury_id":43},{"severity_id":"44Mi","severity":"Mild","frequency":0.6,"recovery_time_avg":3,"can_continue_playing":"Yes","injury_id":44},{"severity_id":"45Mo","severity":"Moderate","frequency":0.2,"recovery_time_avg":4,"can_continue_playing":"No","injury_id":45},{"severity_id":"46Mo","severity":"Moderate","frequency":0.04,"recovery_time_avg":4,"can_continue_playing":"No","injury_id":46},{"severity_id":"47Mo","severity":"Moderate","frequency":0.25,"recovery_time_avg":4,"can_continue_playing":"No","injury_id":47},{"severity_id":"48Mo","severity":"Moderate","frequency":0.15,"recovery_time_avg":4,"can_continue_playing":"No","injury_id":48},{"severity_id":"48Se","severity":"Severe","frequency":0.15,"recovery_time_avg":12,"can_continue_playing":"No","injury_id":48}],"moves":[{"move_id":1,"move_name":"Driving to the Basket","move_description":"Dribble-drive toward the hoop, often with a defender in pursuit"},{"move_id":2,"move_name":"Jump Shot (shooting motion)","move_description":"Repetitive jumping and shooting mechanics"},{"move_id":3,"move_name":"Landing from a Jump","move_description":"Coming down from a rebound, layup, or shot attempt"},{"move_id":4,"move_name":"Cutting/Changing Direction","move_description":"Crossovers, defensive slides, and sudden direction changes"},{"move_id":5,"move_name":"Boxing Out/Post-Up","move_description":"Physical positioning and contact battling for space"},{"move_id":6,"move_name":"Blocking or Contesting a Shot","move_description":"Reaching to alter or block an opponent's shot"},{"move_id":7,"move_name":"Diving for a Loose Ball / Falling","move_description":"Diving on the floor or falling from contact"},{"move_id":8,"move_name":"Fast Break Sprint","move_description":"Explosive full-speed running in transition"},{"move_id":9,"move_name":"Pitching","move_description":"Full overhead throwing motion (wind-up through follow-through)"},{"move_id":10,"move_name":"Batting/Swing","move_description":"Rotational swing to hit a pitched ball"},{"move_id":11,"move_name":"Base Running","move_description":"Sprinting between bases"},{"move_id":12,"move_name":"Sliding","move_description":"Feet-first or head-first slide into a base"},{"move_id":13,"move_name":"Fielding a Ground Ball","move_description":"Bending/lateral movement to field, followed by a throw"},{"move_id":14,"move_name":"Catching/Blocking (catcher)","move_description":"Repetitive squatting, blocking, framing"},{"move_id":15,"move_name":"Diving/Collision","move_description":"Diving for a catch or colliding with wall/player"},{"move_id":16,"move_name":"Hit By Pitch","move_description":"Direct ball contact with batter/catcher"},{"move_id":17,"move_name":"Tackling / Collision","move_description":"Direct physical contact with another player involving forceful impact between the body or limbs"},{"move_id":18,"move_name":"Sudden Cutting","move_description":"Rapidly changing direction while running, placing high stress on the knees, ankles, and other lower-extremity joints"},{"move_id":19,"move_name":"Explosive Sprinting","move_description":"Rapidly accelerating from a stationary or slow position, requiring sudden, powerful contraction of the leg muscles"},{"move_id":20,"move_name":"Absorbing Contact","move_description":"Bracing for and receiving physical impact from another player or external force while maintaining balance and body position"},{"move_id":21,"move_name":"Landing After Jump","move_description":"Returning to the ground after jumping, requiring controlled absorption of body weight and impact through the ankles, knees, and hips"},{"move_id":22,"move_name":"Running/Sprinting","move_description":"High-speed movement to chase the ball or create space"},{"move_id":23,"move_name":"Passing","move_description":"Striking the ball to a teammate with control and accuracy"},{"move_id":24,"move_name":"Kicking/Shooting","move_description":"Forceful strike on the ball, usually aimed at goal"},{"move_id":25,"move_name":"Dribbling","move_description":"Close ball control while moving past defenders"},{"move_id":26,"move_name":"Receiving/Trapping","move_description":"Controlling an incoming ball with foot, chest, or thigh"},{"move_id":27,"move_name":"Heading","move_description":"Using the head to pass, clear, or score"},{"move_id":28,"move_name":"Jumping/Landing","move_description":"Vertical leap (often for headers) with controlled landing"},{"move_id":29,"move_name":"Sliding Tackle","move_description":"Sliding on the ground to dispossess an opponent"},{"move_id":30,"move_name":"Goalkeeper Save/Dive","move_description":"Diving or reaching to stop the ball from entering the goal"}],"moveInjury":[{"move_id":1,"injury_id":2},{"move_id":1,"injury_id":1},{"move_id":2,"injury_id":4},{"move_id":2,"injury_id":9},{"move_id":3,"injury_id":1},{"move_id":3,"injury_id":2},{"move_id":4,"injury_id":2},{"move_id":4,"injury_id":8},{"move_id":5,"injury_id":9},{"move_id":5,"injury_id":6},{"move_id":5,"injury_id":7},{"move_id":6,"injury_id":6},{"move_id":6,"injury_id":7},{"move_id":6,"injury_id":11},{"move_id":6,"injury_id":12},{"move_id":7,"injury_id":11},{"move_id":7,"injury_id":12},{"move_id":7,"injury_id":10},{"move_id":8,"injury_id":8},{"move_id":8,"injury_id":5},{"move_id":9,"injury_id":16},{"move_id":9,"injury_id":13},{"move_id":9,"injury_id":14},{"move_id":10,"injury_id":18},{"move_id":10,"injury_id":17},{"move_id":11,"injury_id":19},{"move_id":11,"injury_id":20},{"move_id":12,"injury_id":20},{"move_id":12,"injury_id":22},{"move_id":12,"injury_id":23},{"move_id":13,"injury_id":19},{"move_id":13,"injury_id":24},{"move_id":13,"injury_id":25},{"move_id":14,"injury_id":24},{"move_id":14,"injury_id":25},{"move_id":14,"injury_id":21},{"move_id":15,"injury_id":21},{"move_id":15,"injury_id":20},{"move_id":16,"injury_id":22},{"move_id":16,"injury_id":23},{"move_id":16,"injury_id":21},{"move_id":17,"injury_id":28},{"move_id":17,"injury_id":32},{"move_id":18,"injury_id":27},{"move_id":18,"injury_id":29},{"move_id":19,"injury_id":30},{"move_id":19,"injury_id":34},{"move_id":20,"injury_id":31},{"move_id":20,"injury_id":35},{"move_id":21,"injury_id":29},{"move_id":21,"injury_id":36},{"move_id":22,"injury_id":44},{"move_id":22,"injury_id":47},{"move_id":23,"injury_id":44},{"move_id":23,"injury_id":43},{"move_id":24,"injury_id":44},{"move_id":24,"injury_id":43},{"move_id":25,"injury_id":37},{"move_id":25,"injury_id":40},{"move_id":26,"injury_id":37},{"move_id":26,"injury_id":41},{"move_id":27,"injury_id":42},{"move_id":27,"injury_id":37},{"move_id":28,"injury_id":37},{"move_id":28,"injury_id":40},{"move_id":29,"injury_id":41},{"move_id":29,"injury_id":37},{"move_id":30,"injury_id":48},{"move_id":30,"injury_id":37},{"move_id":30,"injury_id":40}]}
;

const SPORTS = ['Basketball', 'Baseball', 'Football', 'Soccer'];

const SPORT_META = {
  Basketball: { icon: Activity, blurb: 'Landing, cutting, and jump-shot mechanics' },
  Baseball:   { icon: Zap,      blurb: 'Throwing, swinging, and base running' },
  Football:   { icon: ShieldAlert, blurb: 'Contact, tackling, and explosive sprints' },
  Soccer:     { icon: HeartPulse, blurb: 'Sprinting, cutting, and striking the ball' },
};

const SYMPTOM_FIELDS = [
  { key: 'swelling', label: 'Swelling', hint: 'Puffiness or fluid buildup around the area' },
  { key: 'bruising', label: 'Bruising', hint: 'Discoloration under the skin' },
  { key: 'instability', label: 'Instability', hint: 'Feels like it could give out or shift' },
  { key: 'limited_range_of_motion', label: 'Limited motion', hint: "Can't move it through its full range" },
  { key: 'audible_pop', label: 'Audible pop', hint: 'Heard or felt a pop or snap at the moment of injury' },
];

const RED_FLAGS = [
  { key: 'deformity', text: 'Does the area look visibly out of place, bent, or deformed?' },
  { key: 'nerve', text: 'Any numbness, tingling, or a change in skin color below the injury?' },
  { key: 'wound', text: 'Is there an open wound, or is bone visible?' },
  { key: 'loc', text: 'Was there a hit to the head with loss of consciousness or confusion?' },
];

const TIERS = {
  emergency: {
    label: 'Get emergency care now',
    time: 'Right now',
    color: '#A23327',
    bg: '#FBEAE7',
    Icon: AlertTriangle,
    copy: "One or more answers point to something that needs immediate medical attention. Head to an emergency room or call your campus's emergency line — don't wait this one out.",
  },
  urgent: {
    label: 'Get seen today',
    time: 'Within hours',
    color: '#B4691A',
    bg: '#FBF0E2',
    Icon: Zap,
    copy: "This pattern is consistent with something that shouldn't wait. Stop playing, get an athletic trainer or urgent care to look at it today.",
  },
  clinician: {
    label: 'See a clinician soon',
    time: 'Next 1–2 days',
    color: '#33587A',
    bg: '#E9F0F6',
    Icon: Stethoscope,
    copy: "Worth a proper look, but it doesn't read as an emergency. Book a visit with a doctor or athletic trainer in the next day or two.",
  },
  selfcare: {
    label: 'Likely fine to self-manage',
    time: 'Monitor at home',
    color: '#3E7A52',
    bg: '#EAF3EC',
    Icon: CircleCheck,
    copy: "Nothing here points to a serious injury. Rest, ice, and keep an eye on it — see a clinician if it isn't improving in a few days or gets worse.",
  },
};

/* ---------------------------------------------------------------
   MATCHING LOGIC
   A rules-based stand-in for the eventual model: scores every
   injury on record for the chosen sport against the mechanism,
   body part, and reported symptoms, then a small set of
   red-flag / weight-bearing questions sets the urgency tier.
--------------------------------------------------------------- */
function movesForSport(sport) {
  const injuryIds = new Set(DB.injuries.filter(i => i.injury_sport === sport).map(i => i.injury_id));
  const moveIds = new Set(DB.moveInjury.filter(mi => injuryIds.has(mi.injury_id)).map(mi => mi.move_id));
  return DB.moves.filter(m => moveIds.has(m.move_id));
}

function bodyPartsForSport(sport) {
  return [...new Set(DB.injuries.filter(i => i.injury_sport === sport).map(i => i.body_part))];
}

function dominantSeverity(injuryId) {
  const rows = DB.severities.filter(s => s.injury_id === injuryId);
  if (!rows.length) return null;
  return [...rows].sort((a, b) => b.frequency - a.frequency)[0];
}

function scoreInjuries({ sport, moveId, bodyPart, symptoms }) {
  const candidates = DB.injuries.filter(i => i.injury_sport === sport);
  const linkedInjuryIds = new Set(
    DB.moveInjury.filter(mi => mi.move_id === moveId).map(mi => mi.injury_id)
  );

  return candidates
    .map(inj => {
      let score = 0;
      const reasons = [];

      if (moveId && linkedInjuryIds.has(inj.injury_id)) {
        score += 4;
        reasons.push('Matches how this usually happens');
      }
      if (bodyPart && inj.body_part === bodyPart) {
        score += 3;
        reasons.push('Same body part');
      }
      SYMPTOM_FIELDS.forEach(({ key, label }) => {
        const userAns = symptoms[key];
        if (!userAns || userAns === 'unsure') return;
        const injVal = inj[key];
        if (injVal === 'Sometimes') {
          score += 1;
        } else if ((injVal === 'Yes' && userAns === 'yes') || (injVal === 'No' && userAns === 'no')) {
          score += 2;
          reasons.push(`Reported ${label.toLowerCase()} fits this injury`);
        } else {
          score -= 2;
        }
      });

      return { ...inj, score, reasons, severity: dominantSeverity(inj.injury_id) };
    })
    .sort((a, b) => b.score - a.score)
    .filter(r => r.score > 0)
    .slice(0, 4);
}

function decideTier({ redFlags, weightBearing, topMatch }) {
  if (Object.values(redFlags).some(v => v === 'yes')) return 'emergency';
  if (weightBearing !== 'yes') return 'urgent'; // 'no' or 'unsure' both default to caution
  if (!topMatch || !topMatch.severity) return 'clinician';
  const sev = topMatch.severity.severity;
  if (sev === 'Severe') return 'urgent';
  if (sev === 'Moderate') return 'clinician';
  return 'selfcare';
}

/* ---------------------------------------------------------------
   SMALL UI PRIMITIVES
--------------------------------------------------------------- */
function Shell({ children }) {
  return (
    <div style={{
      minHeight: '100%', background: '#EEF0EA', color: '#17211C',
      fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');
        .display { font-family: 'Big Shoulders Display', 'Inter', sans-serif; letter-spacing: 0.01em; }
        .tick-track { display:flex; gap:4px; }
        .tick { height:4px; flex:1; background:#D7DBD0; border-radius:2px; }
        .tick.on { background:#2E5D42; }
        button { font-family: inherit; }
        .opt-btn { transition: all .12s ease; }
        .opt-btn:hover { border-color:#2E5D42 !important; }
      `}</style>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '28px 20px 64px' }}>
        {children}
      </div>
    </div>
  );
}

function TopBar({ title, onBack }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
      {onBack && (
        <button onClick={onBack} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 34, height: 34, borderRadius: 8, border: '1px solid #D7DBD0',
          background: '#fff', cursor: 'pointer', flexShrink: 0,
        }}>
          <ArrowLeft size={16} color="#17211C" />
        </button>
      )}
      <div className="display" style={{ fontSize: 22, fontWeight: 700 }}>{title}</div>
    </div>
  );
}

function Progress({ step, total }) {
  return (
    <div style={{ marginBottom: 26 }}>
      <div className="tick-track">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className={`tick ${i <= step ? 'on' : ''}`} />
        ))}
      </div>
      <div style={{ fontSize: 12, color: '#5B6960', marginTop: 6 }}>
        Step {step + 1} of {total}
      </div>
    </div>
  );
}

function Card({ children, onClick, active, style }) {
  return (
    <div
      onClick={onClick}
      className={onClick ? 'opt-btn' : ''}
      style={{
        background: '#fff', border: `1.5px solid ${active ? '#2E5D42' : '#D7DBD0'}`,
        borderRadius: 10, padding: '16px 18px', cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function PrimaryButton({ children, onClick, disabled, full }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: disabled ? '#C7CCC1' : '#2E5D42', color: '#fff', border: 'none',
        borderRadius: 9, padding: '13px 22px', fontSize: 15, fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer', display: 'inline-flex',
        alignItems: 'center', justifyContent: 'center', gap: 8,
        width: full ? '100%' : 'auto',
      }}
    >
      {children}
    </button>
  );
}

function YesNoUnsure({ value, onChange }) {
  const opts = [['yes', 'Yes'], ['no', 'No'], ['unsure', 'Not sure']];
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {opts.map(([v, label]) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className="opt-btn"
          style={{
            flex: 1, padding: '10px 0', borderRadius: 8, fontSize: 13.5, fontWeight: 600,
            border: `1.5px solid ${value === v ? '#2E5D42' : '#D7DBD0'}`,
            background: value === v ? '#2E5D42' : '#fff',
            color: value === v ? '#fff' : '#17211C', cursor: 'pointer',
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------
   SCREENS
--------------------------------------------------------------- */
function Dashboard({ onReport, onNav }) {
  return (
    <Shell>
      <div style={{ marginBottom: 30 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#2E5D42', marginBottom: 4 }}>
          SIDELINE
        </div>
        <div className="display" style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.05 }}>
          What's hurting, and what do you do about it.
        </div>
        <div style={{ fontSize: 14.5, color: '#5B6960', marginTop: 8, maxWidth: 480 }}>
          Answer a few questions about what happened and how it feels — get a sense of
          how serious it might be and where to go next.
        </div>
      </div>

      <Card onClick={onReport} style={{ marginBottom: 14, padding: '22px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 5 }}>
              <ClipboardList size={18} color="#2E5D42" />
              <div style={{ fontSize: 17, fontWeight: 700 }}>Report an injury</div>
            </div>
            <div style={{ fontSize: 13.5, color: '#5B6960' }}>
              Start here — takes about two minutes
            </div>
          </div>
          <ChevronRight size={20} color="#2E5D42" />
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[
          { key: 'history', title: 'Past history', icon: History, desc: 'Injuries you\u2019ve logged before' },
          { key: 'return', title: 'Return to play', icon: RotateCcw, desc: 'Track recovery day by day' },
          { key: 'data', title: 'My data', icon: User, desc: 'A body map of past injuries' },
          { key: 'visits', title: 'My visits', icon: Stethoscope, desc: 'Clinic and trainer visits' },
        ].map(({ key, title, icon: Icon, desc }) => (
          <Card key={key} onClick={() => onNav(key)}>
            <Icon size={17} color="#5B6960" />
            <div style={{ fontSize: 14.5, fontWeight: 700, marginTop: 9 }}>{title}</div>
            <div style={{ fontSize: 12.5, color: '#5B6960', marginTop: 2 }}>{desc}</div>
          </Card>
        ))}
      </div>

      <div style={{
        marginTop: 22, fontSize: 12, color: '#5B6960', lineHeight: 1.5,
        borderTop: '1px solid #D7DBD0', paddingTop: 14,
      }}>
        This tool doesn't diagnose anything. It's a starting point built from reported
        injury patterns, not a substitute for a clinician.
      </div>
    </Shell>
  );
}

function Placeholder({ title, desc, onBack }) {
  return (
    <Shell>
      <TopBar title={title} onBack={onBack} />
      <Card style={{ padding: '26px 20px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', width: 40, height: 40, borderRadius: '50%',
          background: '#E9EBE4', alignItems: 'center', justifyContent: 'center', marginBottom: 12,
        }}>
          <Info size={18} color="#5B6960" />
        </div>
        <div style={{ fontSize: 14.5, fontWeight: 600, marginBottom: 4 }}>In development</div>
        <div style={{ fontSize: 13.5, color: '#5B6960', maxWidth: 340, margin: '0 auto' }}>{desc}</div>
      </Card>
    </Shell>
  );
}

const PLACEHOLDER_COPY = {
  history: 'Every injury you report will be saved here, so you and your trainer can see what keeps coming back.',
  return: 'Once an injury is logged, this will track your recovery day by day against the expected timeline.',
  data: 'A body map showing where you\u2019ve been hurt over time, built from your reported injuries.',
  visits: 'A log of clinic and athletic-trainer visits tied to each reported injury.',
};

function ReportFlow({ onExit }) {
  const [step, setStep] = useState(0);
  const [sport, setSport] = useState(null);
  const [redFlags, setRedFlags] = useState({});
  const [moveId, setMoveId] = useState(null);
  const [bodyPart, setBodyPart] = useState(null);
  const [weightBearing, setWeightBearing] = useState(null);
  const [symptoms, setSymptoms] = useState({});

  const moves = useMemo(() => (sport ? movesForSport(sport) : []), [sport]);
  const bodyParts = useMemo(() => (sport ? bodyPartsForSport(sport) : []), [sport]);
  const redFlagTriggered = Object.values(redFlags).some(v => v === 'yes');

  const results = useMemo(() => {
    if (!sport || redFlagTriggered) return [];
    return scoreInjuries({ sport, moveId, bodyPart, symptoms });
  }, [sport, moveId, bodyPart, symptoms, redFlagTriggered]);

  const tierKey = useMemo(() => {
    if (!sport) return null;
    return decideTier({ redFlags, weightBearing, topMatch: results[0] });
  }, [redFlags, weightBearing, results, sport]);

  const STEPS = ['sport', 'redflags', 'mechanism', 'symptoms', 'results'];
  const total = STEPS.length - 1;

  const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const back = () => (step === 0 ? onExit() : setStep(s => s - 1));

  const allRedFlagsAnswered = RED_FLAGS.every(f => redFlags[f.key]);
  const allSymptomsAnswered = SYMPTOM_FIELDS.every(f => symptoms[f.key]) && weightBearing;

  return (
    <Shell>
      <TopBar title="Report an injury" onBack={back} />
      {step < 4 && <Progress step={step} total={total} />}

      {step === 0 && (
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Which sport?</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {SPORTS.map(s => {
              const meta = SPORT_META[s];
              const Icon = meta.icon;
              return (
                <Card key={s} active={sport === s} onClick={() => { setSport(s); setStep(1); }}>
                  <Icon size={18} color={sport === s ? '#2E5D42' : '#5B6960'} />
                  <div style={{ fontSize: 15.5, fontWeight: 700, marginTop: 10 }}>{s}</div>
                  <div style={{ fontSize: 12, color: '#5B6960', marginTop: 3 }}>{meta.blurb}</div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {step === 1 && (
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 3 }}>Quick safety check</div>
          <div style={{ fontSize: 13, color: '#5B6960', marginBottom: 16 }}>
            Answer these first — they matter more than anything else.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            {RED_FLAGS.map(f => (
              <Card key={f.key} style={{ padding: '14px 16px' }}>
                <div style={{ fontSize: 13.5, fontWeight: 500, marginBottom: 10 }}>{f.text}</div>
                <YesNoUnsure
                  value={redFlags[f.key]}
                  onChange={v => setRedFlags(r => ({ ...r, [f.key]: v }))}
                />
              </Card>
            ))}
          </div>
          <PrimaryButton full disabled={!allRedFlagsAnswered} onClick={() => {
            if (Object.values(redFlags).some(v => v === 'yes')) setStep(4);
            else next();
          }}>
            Continue <ArrowRight size={15} />
          </PrimaryButton>
        </div>
      )}

      {step === 2 && (
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 3 }}>What were you doing?</div>
          <div style={{ fontSize: 13, color: '#5B6960', marginBottom: 16 }}>
            Pick the closest match to what you were doing when it happened.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 22, maxHeight: 320, overflowY: 'auto' }}>
            {moves.map(m => (
              <Card key={m.move_id} active={moveId === m.move_id} onClick={() => setMoveId(m.move_id)} style={{ padding: '13px 16px' }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{m.move_name}</div>
                <div style={{ fontSize: 12, color: '#5B6960', marginTop: 2 }}>{m.move_description}</div>
              </Card>
            ))}
          </div>

          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 10 }}>Where does it hurt?</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 22 }}>
            {bodyParts.map(bp => (
              <button
                key={bp}
                onClick={() => setBodyPart(bp)}
                className="opt-btn"
                style={{
                  padding: '9px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                  border: `1.5px solid ${bodyPart === bp ? '#2E5D42' : '#D7DBD0'}`,
                  background: bodyPart === bp ? '#2E5D42' : '#fff',
                  color: bodyPart === bp ? '#fff' : '#17211C', cursor: 'pointer',
                }}
              >
                {bp}
              </button>
            ))}
          </div>

          <PrimaryButton full disabled={!moveId || !bodyPart} onClick={next}>
            Continue <ArrowRight size={15} />
          </PrimaryButton>
        </div>
      )}

      {step === 3 && (
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 3 }}>How does it feel?</div>
          <div style={{ fontSize: 13, color: '#5B6960', marginBottom: 16 }}>
            Not sure is a fine answer — better than guessing.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
            {SYMPTOM_FIELDS.map(f => (
              <Card key={f.key} style={{ padding: '14px 16px' }}>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{f.label}</div>
                <div style={{ fontSize: 11.5, color: '#5B6960', marginBottom: 10 }}>{f.hint}</div>
                <YesNoUnsure value={symptoms[f.key]} onChange={v => setSymptoms(s => ({ ...s, [f.key]: v }))} />
              </Card>
            ))}
            <Card style={{ padding: '14px 16px', borderColor: '#B9C2AE' }}>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>Can you bear weight on it / keep playing right now?</div>
              <div style={{ fontSize: 11.5, color: '#5B6960', marginBottom: 10 }}>
                Be honest — pushing through matters here
              </div>
              <YesNoUnsure value={weightBearing} onChange={setWeightBearing} />
            </Card>
          </div>
          <PrimaryButton full disabled={!allSymptomsAnswered} onClick={next}>
            See what it might be <ArrowRight size={15} />
          </PrimaryButton>
        </div>
      )}

      {step === 4 && tierKey && (
        <ResultsScreen
          tierKey={tierKey}
          redFlagTriggered={redFlagTriggered}
          results={results}
          sport={sport}
          onRestart={() => {
            setStep(0); setSport(null); setRedFlags({}); setMoveId(null);
            setBodyPart(null); setWeightBearing(null); setSymptoms({});
          }}
          onExit={onExit}
        />
      )}
    </Shell>
  );
}

function ResultsScreen({ tierKey, redFlagTriggered, results, onRestart, onExit }) {
  const tier = TIERS[tierKey];
  const Icon = tier.Icon;

  return (
    <div>
      <div style={{
        background: tier.bg, border: `1.5px solid ${tier.color}22`, borderRadius: 12,
        padding: '20px 20px', marginBottom: 22,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <Icon size={20} color={tier.color} />
          <div className="display" style={{ fontSize: 20, fontWeight: 800, color: tier.color }}>
            {tier.label}
          </div>
        </div>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: tier.color, marginBottom: 10, textTransform: 'none' }}>
          {tier.time}
        </div>
        <div style={{ fontSize: 13.5, color: '#17211C', lineHeight: 1.55 }}>{tier.copy}</div>
      </div>

      {!redFlagTriggered && results.length > 0 && (
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 3 }}>What it could be</div>
          <div style={{ fontSize: 12.5, color: '#5B6960', marginBottom: 14 }}>
            Ranked by how well it matches what you described — not a diagnosis.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {results.map((r, idx) => (
              <Card key={r.injury_id} style={{ padding: '15px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{r.injury_name}</div>
                  {idx === 0 && (
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: '#2E5D42', background: '#E4EEE6', padding: '2px 8px', borderRadius: 20 }}>
                      CLOSEST MATCH
                    </div>
                  )}
                </div>
                <div style={{ fontSize: 12, color: '#5B6960', marginTop: 2 }}>{r.body_part}</div>

                {r.severity && (
                  <div style={{ display: 'flex', gap: 14, marginTop: 10, fontSize: 12 }}>
                    <div><span style={{ color: '#5B6960' }}>Typical severity </span><b>{r.severity.severity}</b></div>
                    <div><span style={{ color: '#5B6960' }}>Recovery </span><b>~{r.severity.recovery_time_avg} wk</b></div>
                  </div>
                )}
                {r.reasons.length > 0 && (
                  <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {r.reasons.slice(0, 3).map((reason, i) => (
                      <div key={i} style={{ display: 'flex', gap: 6, fontSize: 11.5, color: '#3E4A41' }}>
                        <Check size={12} color="#2E5D42" style={{ marginTop: 2, flexShrink: 0 }} />
                        {reason}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {!redFlagTriggered && results.length === 0 && (
        <div style={{ fontSize: 13, color: '#5B6960', marginBottom: 22 }}>
          Nothing on file matched closely — that's not unusual, and it doesn't mean it's nothing.
          Use the guidance above either way.
        </div>
      )}

      <div style={{ fontSize: 11.5, color: '#5B6960', lineHeight: 1.5, marginBottom: 22, borderTop: '1px solid #D7DBD0', paddingTop: 14 }}>
        This is not a diagnosis. It's built from patterns in reported injuries to give you a
        starting point — a licensed clinician makes the actual call.
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onRestart} style={{
          flex: 1, padding: '13px 0', borderRadius: 9, fontSize: 14, fontWeight: 600,
          border: '1.5px solid #D7DBD0', background: '#fff', cursor: 'pointer',
        }}>
          Report another
        </button>
        <div style={{ flex: 1 }}><PrimaryButton full onClick={onExit}>Done</PrimaryButton></div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   ROOT
--------------------------------------------------------------- */
export default function SidelineApp() {
  const [screen, setScreen] = useState('dashboard');

  if (screen === 'report') return <ReportFlow onExit={() => setScreen('dashboard')} />;
  if (screen in PLACEHOLDER_COPY) {
    const titles = { history: 'Past history', return: 'Return to play', data: 'My data', visits: 'My visits' };
    return <Placeholder title={titles[screen]} desc={PLACEHOLDER_COPY[screen]} onBack={() => setScreen('dashboard')} />;
  }
  return <Dashboard onReport={() => setScreen('report')} onNav={setScreen} />;
}
