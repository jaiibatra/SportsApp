import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Activity, AlertTriangle, ArrowLeft, ArrowRight, Check, ChevronDown, ChevronRight,
  Clock, CircleCheck, History, HeartPulse, Info, Plus, RotateCcw, ShieldAlert,
  Stethoscope, Trash2, User, Zap,
} from 'lucide-react';

/* ---------------------------------------------------------------
   DATA: parsed from the team's INJURY_GENERAL / INJURY_SEVERITY /
   MOVE / MOVE_INJURY tables (Vegas project, HW1 dataset)
--------------------------------------------------------------- */
const DB = {"injuries":[{"injury_id":1,"injury_name":"Ankle Sprain","injury_sport":"Basketball","body_part":"Ankle","pain_location":"Around the ankle joint, most often lateral (outside)","swelling":"Yes","bruising":"Yes","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Sometimes"},{"injury_id":2,"injury_name":"ACL Tear","injury_sport":"Basketball","body_part":"Knee","pain_location":"Deep in the knee, sometimes diffuse","swelling":"Yes","bruising":"No","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Yes"},{"injury_id":3,"injury_name":"Meniscus Tear","injury_sport":"Basketball","body_part":"Knee","pain_location":"Joint line of the knee (inner or outer)","swelling":"Yes","bruising":"No","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Sometimes"},{"injury_id":4,"injury_name":"Patellar Tendinitis - Jumper's Knee","injury_sport":"Basketball","body_part":"Knee","pain_location":"Just below the kneecap, at the patellar tendon","swelling":"No","bruising":"No","instability":"No","limited_range_of_motion":"Yes","audible_pop":"No"},{"injury_id":5,"injury_name":"Achilles Tendon Rupture","injury_sport":"Basketball","body_part":"Lower Calf","pain_location":"Back of the ankle/lower calf","swelling":"Yes","bruising":"Yes","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Yes"},{"injury_id":6,"injury_name":"Finger Sprain","injury_sport":"Basketball","body_part":"Finger Joint","pain_location":"Localized to the affected finger joint","swelling":"Yes","bruising":"Yes","instability":"No","limited_range_of_motion":"Yes","audible_pop":"No"},{"injury_id":7,"injury_name":"Finger Fracture","injury_sport":"Basketball","body_part":"Finger Joint","pain_location":"Localized to the affected finger joint","swelling":"Yes","bruising":"Yes","instability":"Sometimes","limited_range_of_motion":"Yes","audible_pop":"No"},{"injury_id":8,"injury_name":"Hamstring Strain","injury_sport":"Basketball","body_part":"Hamstring","pain_location":"Back of the thigh, sudden and sharp mid-sprint","swelling":"Sometimes","bruising":"Yes","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Sometimes"},{"injury_id":9,"injury_name":"Lower Back Strain","injury_sport":"Basketball","body_part":"Lower Back","pain_location":"Lower b ack, sometimes radiating to hip","swelling":"No","bruising":"No","instability":"No","limited_range_of_motion":"Yes","audible_pop":"No"},{"injury_id":10,"injury_name":"Concussion","injury_sport":"Basketball","body_part":"Head","pain_location":"Head/neck, may include headache","swelling":"Sometimes","bruising":"Sometimes","instability":"Yes","limited_range_of_motion":"No","audible_pop":"No"},{"injury_id":11,"injury_name":"Wrist Sprain","injury_sport":"Basketball","body_part":"Wrist","pain_location":"Localized to the wrist, sometimes radiating into the hand","swelling":"Yes","bruising":"Yes","instability":"No","limited_range_of_motion":"Yes","audible_pop":"No"},{"injury_id":12,"injury_name":"Wrist Fracture","injury_sport":"Basketball","body_part":"Wrist","pain_location":"Localized to the wrist, sometimes radiating into the hand","swelling":"Yes","bruising":"Yes","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"No"},{"injury_id":13,"injury_name":"Rotator Cuff Strain","injury_sport":"Baseball","body_part":"Shoulder","pain_location":"Front/side of shoulder, may radiate down arm","swelling":"No","bruising":"No","instability":"No","limited_range_of_motion":"Yes","audible_pop":"No"},{"injury_id":14,"injury_name":"Rotator Cuff Tear","injury_sport":"Baseball","body_part":"Shoulder","pain_location":"Front/side of shoulder, may radiate down arm","swelling":"No","bruising":"Sometimes","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"No"},{"injury_id":15,"injury_name":"UCL Sprain","injury_sport":"Baseball","body_part":"Elbow","pain_location":"Inner (medial) elbow","swelling":"No","bruising":"No","instability":"Yes","limited_range_of_motion":"No","audible_pop":"No"},{"injury_id":16,"injury_name":"UCL Tear","injury_sport":"Baseball","body_part":"Elbow","pain_location":"Inner (medial) elbow","swelling":"No","bruising":"Sometimes","instability":"Yes","limited_range_of_motion":"No","audible_pop":"Yes"},{"injury_id":17,"injury_name":"Labral Tear - Shoulder","injury_sport":"Baseball","body_part":"Shoulder","pain_location":"Deep in shoulder joint, catching sensation","swelling":"No","bruising":"No","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Sometimes"},{"injury_id":18,"injury_name":"Oblique Strain","injury_sport":"Baseball","body_part":"Torso","pain_location":"Side of torso/ribcage, sharp and localized","swelling":"No","bruising":"Sometimes","instability":"No","limited_range_of_motion":"Yes","audible_pop":"No"},{"injury_id":19,"injury_name":"Hamstring Strain","injury_sport":"Baseball","body_part":"Hamstring","pain_location":"Back of thigh, sudden/sharp mid-sprint","swelling":"Sometimes","bruising":"Yes","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Sometimes"},{"injury_id":20,"injury_name":"Ankle Sprain","injury_sport":"Baseball","body_part":"Ankle","pain_location":"Around ankle joint, lateral side most common","swelling":"Yes","bruising":"Yes","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Sometimes"},{"injury_id":21,"injury_name":"Concussion","injury_sport":"Baseball","body_part":"Head","pain_location":"Head/neck, possible headache","swelling":"Sometimes","bruising":"Sometimes","instability":"Yes","limited_range_of_motion":"No","audible_pop":"No"},{"injury_id":22,"injury_name":"Hand Contusion","injury_sport":"Baseball","body_part":"Hand","pain_location":"Localized to impact point","swelling":"Yes","bruising":"Yes","instability":"No","limited_range_of_motion":"Yes","audible_pop":"No"},{"injury_id":23,"injury_name":"Wrist Fracture","injury_sport":"Baseball","body_part":"Wrist","pain_location":"Localized to impact point","swelling":"Yes","bruising":"Yes","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"No"},{"injury_id":24,"injury_name":"Knee Injury - Meniscus","injury_sport":"Baseball","body_part":"Knee","pain_location":"Around/behind kneecap, or joint line","swelling":"Yes","bruising":"No","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Sometimes"},{"injury_id":25,"injury_name":"Knee Injury - Patellar","injury_sport":"Baseball","body_part":"Knee","pain_location":"Around/behind kneecap, or joint line","swelling":"Yes","bruising":"No","instability":"No","limited_range_of_motion":"Yes","audible_pop":"No"},{"injury_id":26,"injury_name":"Lower Back Strain / Spondylolysis","injury_sport":"Baseball","body_part":"Lower Back","pain_location":"Lower back, may radiate to hip/buttock","swelling":"No","bruising":"No","instability":"No","limited_range_of_motion":"Yes","audible_pop":"No"},{"injury_id":27,"injury_name":"ACL Tear","injury_sport":"Football","body_part":"Knee","pain_location":"Deep in the knee joint","swelling":"Yes","bruising":"No","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Yes"},{"injury_id":28,"injury_name":"Concussion","injury_sport":"Football","body_part":"Head","pain_location":"Generalized headache or pressure in the head","swelling":"No","bruising":"No","instability":"Yes","limited_range_of_motion":"No","audible_pop":"No"},{"injury_id":29,"injury_name":"Ankle Sprain","injury_sport":"Football","body_part":"Ankle","pain_location":"Above the ankle joint, between the tibia and fibula","swelling":"Yes","bruising":"Yes","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Sometimes"},{"injury_id":30,"injury_name":"Hamstring Strain","injury_sport":"Football","body_part":"Hamstring","pain_location":"Back of the thigh","swelling":"Sometimes","bruising":"Yes","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Sometimes"},{"injury_id":31,"injury_name":"MCL Sprain","injury_sport":"Football","body_part":"Knee","pain_location":"Inner side of knee","swelling":"Yes","bruising":"Sometimes","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Sometimes"},{"injury_id":32,"injury_name":"Shoulder Dislocation","injury_sport":"Football","body_part":"Shoulder","pain_location":"Outer shoulder/deltoid area","swelling":"Yes","bruising":"No","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Yes"},{"injury_id":33,"injury_name":"Turf Toe","injury_sport":"Football","body_part":"Big Toe","pain_location":"Base of big toe","swelling":"Yes","bruising":"Sometimes","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Sometimes"},{"injury_id":34,"injury_name":"Achilles Tear","injury_sport":"Football","body_part":"Achilles Tendon","pain_location":"Back of ankle/heel","swelling":"Yes","bruising":"Yes","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Yes"},{"injury_id":35,"injury_name":"Rib Fracture","injury_sport":"Football","body_part":"Chest","pain_location":"Side or front of chest","swelling":"Sometimes","bruising":"Sometimes","instability":"No","limited_range_of_motion":"Yes","audible_pop":"Sometimes"},{"injury_id":36,"injury_name":"Meniscus Tear","injury_sport":"Football","body_part":"Knee","pain_location":"Inside or outside of knee","swelling":"Yes","bruising":"Sometimes","instability":"Sometimes","limited_range_of_motion":"Yes","audible_pop":"Sometimes"},{"injury_id":37,"injury_name":"Ankle Sprain","injury_sport":"Soccer","body_part":"Ankle","pain_location":"Outside of ankle","swelling":"Yes","bruising":"Yes","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Sometimes"},{"injury_id":38,"injury_name":"Achilles Tendonitis","injury_sport":"Soccer","body_part":"Achilles Tendon","pain_location":"Back of Ankle","swelling":"Sometimes","bruising":"No","instability":"No","limited_range_of_motion":"Sometimes","audible_pop":"No"},{"injury_id":39,"injury_name":"Achilles Tendon Rupture","injury_sport":"Soccer","body_part":"Calf","pain_location":"Lower calf","swelling":"Yes","bruising":"Sometimes","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Yes"},{"injury_id":40,"injury_name":"ACL Tear","injury_sport":"Soccer","body_part":"Knee","pain_location":"Deep inside of knee","swelling":"Yes","bruising":"Sometimes","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Yes"},{"injury_id":41,"injury_name":"MCL Tear","injury_sport":"Soccer","body_part":"Knee","pain_location":"Inner side of knee","swelling":"Yes","bruising":"Sometimes","instability":"Yes","limited_range_of_motion":"Sometimes","audible_pop":"Sometimes"},{"injury_id":42,"injury_name":"Concussion","injury_sport":"Soccer","body_part":"Head","pain_location":"Head","swelling":"No","bruising":"No","instability":"Sometimes","limited_range_of_motion":"No","audible_pop":"No"},{"injury_id":43,"injury_name":"Groin Strain","injury_sport":"Soccer","body_part":"Groin","pain_location":"Groin, can radiate outward to pelvic area","swelling":"Sometimes","bruising":"Sometimes","instability":"No","limited_range_of_motion":"Sometimes","audible_pop":"Sometimes"},{"injury_id":44,"injury_name":"Hamstring Strain","injury_sport":"Soccer","body_part":"Thigh","pain_location":"Back of thigh","swelling":"Sometimes","bruising":"Sometimes","instability":"No","limited_range_of_motion":"Yes","audible_pop":"Sometimes"},{"injury_id":45,"injury_name":"Shin Splint","injury_sport":"Soccer","body_part":"Shin","pain_location":"Front of shin","swelling":"No","bruising":"No","instability":"No","limited_range_of_motion":"No","audible_pop":"No"},{"injury_id":46,"injury_name":"Turf Toe","injury_sport":"Soccer","body_part":"Big Toe","pain_location":"Base of big toe","swelling":"Yes","bruising":"Sometimes","instability":"Sometimes","limited_range_of_motion":"Yes","audible_pop":"Sometimes"},{"injury_id":47,"injury_name":"Calf Strain","injury_sport":"Soccer","body_part":"Calf","pain_location":"Back of lower leg","swelling":"Sometimes","bruising":"Sometimes","instability":"No","limited_range_of_motion":"Yes","audible_pop":"Sometimes"},{"injury_id":48,"injury_name":"Shoulder Dislocation","injury_sport":"Soccer","body_part":"Shoulder","pain_location":"Outer shoulder/deltoid area","swelling":"Yes","bruising":"No","instability":"Yes","limited_range_of_motion":"Yes","audible_pop":"Yes"}],"severities":[{"severity_id":"1Mi","severity":"Mild","frequency":1.47,"recovery_time_avg":2,"can_continue_playing":"Yes","injury_id":1},{"severity_id":"1Mo","severity":"Moderate","frequency":1.47,"recovery_time_avg":4,"can_continue_playing":"No","injury_id":1},{"severity_id":"1Se","severity":"Severe","frequency":1.47,"recovery_time_avg":12,"can_continue_playing":"No","injury_id":1},{"severity_id":"2Se","severity":"Severe","frequency":0.07,"recovery_time_avg":52,"can_continue_playing":"No","injury_id":2},{"severity_id":"3Mo","severity":"Moderate","frequency":0.07,"recovery_time_avg":4,"can_continue_playing":"Yes","injury_id":3},{"severity_id":"3Se","severity":"Severe","frequency":0.07,"recovery_time_avg":16,"can_continue_playing":"No","injury_id":3},{"severity_id":"4Mi","severity":"Mild","frequency":0.12,"recovery_time_avg":4,"can_continue_playing":"Yes","injury_id":4},{"severity_id":"4Mo","severity":"Moderate","frequency":0.12,"recovery_time_avg":12,"can_continue_playing":"Yes","injury_id":4},{"severity_id":"5Se","severity":"Severe","frequency":0.01,"recovery_time_avg":52,"can_continue_playing":"No","injury_id":5},{"severity_id":"6Mi","severity":"Mild","frequency":0.3,"recovery_time_avg":2,"can_continue_playing":"Yes","injury_id":6},{"severity_id":"6Mo","severity":"Moderate","frequency":0.3,"recovery_time_avg":4,"can_continue_playing":"Yes","injury_id":6},{"severity_id":"7Mo","severity":"Moderate","frequency":0.1,"recovery_time_avg":4,"can_continue_playing":"No","injury_id":7},{"severity_id":"7Se","severity":"Severe","frequency":0.1,"recovery_time_avg":6,"can_continue_playing":"No","injury_id":7},{"severity_id":"8Mi","severity":"Mild","frequency":0.18,"recovery_time_avg":3,"can_continue_playing":"No","injury_id":8},{"severity_id":"8Mo","severity":"Moderate","frequency":0.18,"recovery_time_avg":6,"can_continue_playing":"No","injury_id":8},{"severity_id":"9Mi","severity":"Mild","frequency":0.2,"recovery_time_avg":3,"can_continue_playing":"Yes","injury_id":9},{"severity_id":"9Mo","severity":"Moderate","frequency":0.2,"recovery_time_avg":6,"can_continue_playing":"No","injury_id":9},{"severity_id":"9Se","severity":"Severe","frequency":0.2,"recovery_time_avg":12,"can_continue_playing":"No","injury_id":9},{"severity_id":"10Mo","severity":"Moderate","frequency":0.34,"recovery_time_avg":3,"can_continue_playing":"No","injury_id":10},{"severity_id":"11Mi","severity":"Mild","frequency":0.15,"recovery_time_avg":1,"can_continue_playing":"Yes","injury_id":11},{"severity_id":"11Mo","severity":"Moderate","frequency":0.15,"recovery_time_avg":2,"can_continue_playing":"Yes","injury_id":11},{"severity_id":"12Mo","severity":"Moderate","frequency":0.05,"recovery_time_avg":4,"can_continue_playing":"No","injury_id":12},{"severity_id":"12Se","severity":"Severe","frequency":0.05,"recovery_time_avg":8,"can_continue_playing":"No","injury_id":12},{"severity_id":"13Mi","severity":"Mild","frequency":0.15,"recovery_time_avg":2,"can_continue_playing":"Yes","injury_id":13},{"severity_id":"13Mo","severity":"Moderate","frequency":0.15,"recovery_time_avg":6,"can_continue_playing":"Yes","injury_id":13},{"severity_id":"14Mo","severity":"Moderate","frequency":0.03,"recovery_time_avg":12,"can_continue_playing":"No","injury_id":14},{"severity_id":"14Se","severity":"Severe","frequency":0.03,"recovery_time_avg":24,"can_continue_playing":"No","injury_id":14},{"severity_id":"15Mi","severity":"Mild","frequency":0.07,"recovery_time_avg":12,"can_continue_playing":"No","injury_id":15},{"severity_id":"15Mo","severity":"Moderate","frequency":0.07,"recovery_time_avg":24,"can_continue_playing":"No","injury_id":15},{"severity_id":"16Mo","severity":"Moderate","frequency":0.04,"recovery_time_avg":52,"can_continue_playing":"No","injury_id":16},{"severity_id":"16Se","severity":"Severe","frequency":0.04,"recovery_time_avg":78,"can_continue_playing":"No","injury_id":16},{"severity_id":"17Mo","severity":"Moderate","frequency":0.08,"recovery_time_avg":16,"can_continue_playing":"No","injury_id":17},{"severity_id":"17Se","severity":"Severe","frequency":0.08,"recovery_time_avg":52,"can_continue_playing":"No","injury_id":17},{"severity_id":"18Mo","severity":"Moderate","frequency":0.05,"recovery_time_avg":4,"can_continue_playing":"No","injury_id":18},{"severity_id":"19Mi","severity":"Mild","frequency":0.25,"recovery_time_avg":1,"can_continue_playing":"Yes","injury_id":19},{"severity_id":"19Mo","severity":"Moderate","frequency":0.25,"recovery_time_avg":3,"can_continue_playing":"No","injury_id":19},{"severity_id":"19Se","severity":"Severe","frequency":0.25,"recovery_time_avg":6,"can_continue_playing":"No","injury_id":19},{"severity_id":"20Mi","severity":"Mild","frequency":0.37,"recovery_time_avg":2,"can_continue_playing":"No","injury_id":20},{"severity_id":"20Mo","severity":"Moderate","frequency":0.37,"recovery_time_avg":4,"can_continue_playing":"No","injury_id":20},{"severity_id":"20Se","severity":"Severe","frequency":0.37,"recovery_time_avg":12,"can_continue_playing":"No","injury_id":20},{"severity_id":"21Mo","severity":"Moderate","frequency":0.09,"recovery_time_avg":3,"can_continue_playing":"No","injury_id":21},{"severity_id":"22Mi","severity":"Mild","frequency":0.2,"recovery_time_avg":1,"can_continue_playing":"Yes","injury_id":22},{"severity_id":"22Mo","severity":"Moderate","frequency":0.2,"recovery_time_avg":2,"can_continue_playing":"Yes","injury_id":22},{"severity_id":"23Mo","severity":"Moderate","frequency":0.05,"recovery_time_avg":4,"can_continue_playing":"No","injury_id":23},{"severity_id":"23Se","severity":"Severe","frequency":0.05,"recovery_time_avg":8,"can_continue_playing":"No","injury_id":23},{"severity_id":"24Mi","severity":"Mild","frequency":0.03,"recovery_time_avg":2,"can_continue_playing":"Yes","injury_id":24},{"severity_id":"24Mo","severity":"Moderate","frequency":0.03,"recovery_time_avg":4,"can_continue_playing":"Yes","injury_id":24},{"severity_id":"25Mo","severity":"Moderate","frequency":0.05,"recovery_time_avg":8,"can_continue_playing":"No","injury_id":25},{"severity_id":"25Se","severity":"Severe","frequency":0.05,"recovery_time_avg":24,"can_continue_playing":"No","injury_id":25},{"severity_id":"26Mi","severity":"Mild","frequency":0.1,"recovery_time_avg":3,"can_continue_playing":"Yes","injury_id":26},{"severity_id":"26Mo","severity":"Moderate","frequency":0.1,"recovery_time_avg":8,"can_continue_playing":"No","injury_id":26},{"severity_id":"26Se","severity":"Severe","frequency":0.1,"recovery_time_avg":16,"can_continue_playing":"No","injury_id":26},{"severity_id":"27Se","severity":"Severe","frequency":0.07,"recovery_time_avg":52,"can_continue_playing":"No","injury_id":27},{"severity_id":"28Mo","severity":"Moderate","frequency":0.7,"recovery_time_avg":2,"can_continue_playing":"No","injury_id":28},{"severity_id":"29Mi","severity":"Mild","frequency":0.64,"recovery_time_avg":1,"can_continue_playing":"No","injury_id":29},{"severity_id":"29Mo","severity":"Moderate","frequency":0.64,"recovery_time_avg":6,"can_continue_playing":"No","injury_id":29},{"severity_id":"30Mi","severity":"Mild","frequency":0.44,"recovery_time_avg":2,"can_continue_playing":"No","injury_id":30},{"severity_id":"30Mo","severity":"Moderate","frequency":0.44,"recovery_time_avg":4,"can_continue_playing":"No","injury_id":30},{"severity_id":"30Se","severity":"Severe","frequency":0.44,"recovery_time_avg":8,"can_continue_playing":"No","injury_id":30},{"severity_id":"31Mi","severity":"Mild","frequency":0.2,"recovery_time_avg":3,"can_continue_playing":"Yes","injury_id":31},{"severity_id":"31Mo","severity":"Moderate","frequency":0.2,"recovery_time_avg":8,"can_continue_playing":"No","injury_id":31},{"severity_id":"32Mo","severity":"Moderate","frequency":0.15,"recovery_time_avg":4,"can_continue_playing":"No","injury_id":32},{"severity_id":"32Se","severity":"Severe","frequency":0.15,"recovery_time_avg":12,"can_continue_playing":"No","injury_id":32},{"severity_id":"33Mi","severity":"Mild","frequency":0.06,"recovery_time_avg":2,"can_continue_playing":"Yes","injury_id":33},{"severity_id":"33Mo","severity":"Moderate","frequency":0.06,"recovery_time_avg":4,"can_continue_playing":"No","injury_id":33},{"severity_id":"34Se","severity":"Severe","frequency":0.05,"recovery_time_avg":52,"can_continue_playing":"No","injury_id":34},{"severity_id":"35Mo","severity":"Moderate","frequency":0.1,"recovery_time_avg":6,"can_continue_playing":"No","injury_id":35},{"severity_id":"36Mo","severity":"Moderate","frequency":0.1,"recovery_time_avg":6,"can_continue_playing":"No","injury_id":36},{"severity_id":"36Se","severity":"Severe","frequency":0.1,"recovery_time_avg":12,"can_continue_playing":"No","injury_id":36},{"severity_id":"37Mi","severity":"Mild","frequency":0.78,"recovery_time_avg":3,"can_continue_playing":"Yes","injury_id":37},{"severity_id":"38Mo","severity":"Moderate","frequency":0.05,"recovery_time_avg":9,"can_continue_playing":"Yes","injury_id":38},{"severity_id":"39Se","severity":"Severe","frequency":0.01,"recovery_time_avg":39,"can_continue_playing":"No","injury_id":39},{"severity_id":"40Se","severity":"Severe","frequency":0.1,"recovery_time_avg":52,"can_continue_playing":"No","injury_id":40},{"severity_id":"41Mo","severity":"Moderate","frequency":0.08,"recovery_time_avg":6,"can_continue_playing":"No","injury_id":41},{"severity_id":"42Mo","severity":"Moderate","frequency":0.44,"recovery_time_avg":2,"can_continue_playing":"No","injury_id":42},{"severity_id":"43Mo","severity":"Moderate","frequency":0.45,"recovery_time_avg":4,"can_continue_playing":"No","injury_id":43},{"severity_id":"44Mi","severity":"Mild","frequency":0.6,"recovery_time_avg":3,"can_continue_playing":"Yes","injury_id":44},{"severity_id":"45Mo","severity":"Moderate","frequency":0.2,"recovery_time_avg":4,"can_continue_playing":"No","injury_id":45},{"severity_id":"46Mo","severity":"Moderate","frequency":0.04,"recovery_time_avg":4,"can_continue_playing":"No","injury_id":46},{"severity_id":"47Mo","severity":"Moderate","frequency":0.25,"recovery_time_avg":4,"can_continue_playing":"No","injury_id":47},{"severity_id":"48Mo","severity":"Moderate","frequency":0.15,"recovery_time_avg":4,"can_continue_playing":"No","injury_id":48},{"severity_id":"48Se","severity":"Severe","frequency":0.15,"recovery_time_avg":12,"can_continue_playing":"No","injury_id":48}],"moves":[{"move_id":1,"move_name":"Driving to the Basket","move_description":"Dribble-drive toward the hoop, often with a defender in pursuit"},{"move_id":2,"move_name":"Jump Shot (shooting motion)","move_description":"Repetitive jumping and shooting mechanics"},{"move_id":3,"move_name":"Landing from a Jump","move_description":"Coming down from a rebound, layup, or shot attempt"},{"move_id":4,"move_name":"Cutting/Changing Direction","move_description":"Crossovers, defensive slides, and sudden direction changes"},{"move_id":5,"move_name":"Boxing Out/Post-Up","move_description":"Physical positioning and contact battling for space"},{"move_id":6,"move_name":"Blocking or Contesting a Shot","move_description":"Reaching to alter or block an opponent's shot"},{"move_id":7,"move_name":"Diving for a Loose Ball / Falling","move_description":"Diving on the floor or falling from contact"},{"move_id":8,"move_name":"Fast Break Sprint","move_description":"Explosive full-speed running in transition"},{"move_id":9,"move_name":"Pitching","move_description":"Full overhead throwing motion (wind-up through follow-through)"},{"move_id":10,"move_name":"Batting/Swing","move_description":"Rotational swing to hit a pitched ball"},{"move_id":11,"move_name":"Base Running","move_description":"Sprinting between bases"},{"move_id":12,"move_name":"Sliding","move_description":"Feet-first or head-first slide into a base"},{"move_id":13,"move_name":"Fielding a Ground Ball","move_description":"Bending/lateral movement to field, followed by a throw"},{"move_id":14,"move_name":"Catching/Blocking (catcher)","move_description":"Repetitive squatting, blocking, framing"},{"move_id":15,"move_name":"Diving/Collision","move_description":"Diving for a catch or colliding with wall/player"},{"move_id":16,"move_name":"Hit By Pitch","move_description":"Direct ball contact with batter/catcher"},{"move_id":17,"move_name":"Tackling / Collision","move_description":"Direct physical contact with another player involving forceful impact between the body or limbs"},{"move_id":18,"move_name":"Sudden Cutting","move_description":"Rapidly changing direction while running, placing high stress on the knees, ankles, and other lower-extremity joints"},{"move_id":19,"move_name":"Explosive Sprinting","move_description":"Rapidly accelerating from a stationary or slow position, requiring sudden, powerful contraction of the leg muscles"},{"move_id":20,"move_name":"Absorbing Contact","move_description":"Bracing for and receiving physical impact from another player or external force while maintaining balance and body position"},{"move_id":21,"move_name":"Landing After Jump","move_description":"Returning to the ground after jumping, requiring controlled absorption of body weight and impact through the ankles, knees, and hips"},{"move_id":22,"move_name":"Running/Sprinting","move_description":"High-speed movement to chase the ball or create space"},{"move_id":23,"move_name":"Passing","move_description":"Striking the ball to a teammate with control and accuracy"},{"move_id":24,"move_name":"Kicking/Shooting","move_description":"Forceful strike on the ball, usually aimed at goal"},{"move_id":25,"move_name":"Dribbling","move_description":"Close ball control while moving past defenders"},{"move_id":26,"move_name":"Receiving/Trapping","move_description":"Controlling an incoming ball with foot, chest, or thigh"},{"move_id":27,"move_name":"Heading","move_description":"Using the head to pass, clear, or score"},{"move_id":28,"move_name":"Jumping/Landing","move_description":"Vertical leap (often for headers) with controlled landing"},{"move_id":29,"move_name":"Sliding Tackle","move_description":"Sliding on the ground to dispossess an opponent"},{"move_id":30,"move_name":"Goalkeeper Save/Dive","move_description":"Diving or reaching to stop the ball from entering the goal"}],"moveInjury":[{"move_id":1,"injury_id":2},{"move_id":1,"injury_id":1},{"move_id":2,"injury_id":4},{"move_id":2,"injury_id":9},{"move_id":3,"injury_id":1},{"move_id":3,"injury_id":2},{"move_id":4,"injury_id":2},{"move_id":4,"injury_id":8},{"move_id":5,"injury_id":9},{"move_id":5,"injury_id":6},{"move_id":5,"injury_id":7},{"move_id":6,"injury_id":6},{"move_id":6,"injury_id":7},{"move_id":6,"injury_id":11},{"move_id":6,"injury_id":12},{"move_id":7,"injury_id":11},{"move_id":7,"injury_id":12},{"move_id":7,"injury_id":10},{"move_id":8,"injury_id":8},{"move_id":8,"injury_id":5},{"move_id":9,"injury_id":16},{"move_id":9,"injury_id":13},{"move_id":9,"injury_id":14},{"move_id":10,"injury_id":18},{"move_id":10,"injury_id":17},{"move_id":11,"injury_id":19},{"move_id":11,"injury_id":20},{"move_id":12,"injury_id":20},{"move_id":12,"injury_id":22},{"move_id":12,"injury_id":23},{"move_id":13,"injury_id":19},{"move_id":13,"injury_id":24},{"move_id":13,"injury_id":25},{"move_id":14,"injury_id":24},{"move_id":14,"injury_id":25},{"move_id":14,"injury_id":21},{"move_id":15,"injury_id":21},{"move_id":15,"injury_id":20},{"move_id":16,"injury_id":22},{"move_id":16,"injury_id":23},{"move_id":16,"injury_id":21},{"move_id":17,"injury_id":28},{"move_id":17,"injury_id":32},{"move_id":18,"injury_id":27},{"move_id":18,"injury_id":29},{"move_id":19,"injury_id":30},{"move_id":19,"injury_id":34},{"move_id":20,"injury_id":31},{"move_id":20,"injury_id":35},{"move_id":21,"injury_id":29},{"move_id":21,"injury_id":36},{"move_id":22,"injury_id":44},{"move_id":22,"injury_id":47},{"move_id":23,"injury_id":44},{"move_id":23,"injury_id":43},{"move_id":24,"injury_id":44},{"move_id":24,"injury_id":43},{"move_id":25,"injury_id":37},{"move_id":25,"injury_id":40},{"move_id":26,"injury_id":37},{"move_id":26,"injury_id":41},{"move_id":27,"injury_id":42},{"move_id":27,"injury_id":37},{"move_id":28,"injury_id":37},{"move_id":28,"injury_id":40},{"move_id":29,"injury_id":41},{"move_id":29,"injury_id":37},{"move_id":30,"injury_id":48},{"move_id":30,"injury_id":37},{"move_id":30,"injury_id":40}]};

const SPORTS = ['Basketball', 'Baseball', 'Football', 'Soccer'];

const SPORT_META = {
  Basketball: { icon: Activity, blurb: 'Landing, cutting, and jump shots' },
  Baseball: { icon: Zap, blurb: 'Throwing, swinging, and base running' },
  Football: { icon: ShieldAlert, blurb: 'Contact, tackling, and sprints' },
  Soccer: { icon: HeartPulse, blurb: 'Sprinting, cutting, and striking' },
};

const SYMPTOM_FIELDS = [
  { key: 'swelling', label: 'Swelling', hint: 'Puffiness or fluid buildup around the area' },
  { key: 'bruising', label: 'Bruising', hint: 'Discoloration under the skin' },
  { key: 'instability', label: 'Instability', hint: 'Feels like it could give out or shift' },
  { key: 'limited_range_of_motion', label: 'Limited motion', hint: "Can't move it through its full range" },
  { key: 'audible_pop', label: 'Audible pop', hint: 'Heard or felt a pop or snap at the moment of injury' },
];

const RED_FLAGS = [
  { key: 'deformity', short: 'Visible deformity', text: 'Does the area look visibly out of place, bent, or deformed?' },
  { key: 'nerve', short: 'Numbness or color change', text: 'Any numbness, tingling, or a change in skin color below the injury?' },
  { key: 'wound', short: 'Open wound or exposed bone', text: 'Is there an open wound, or is bone visible?' },
  { key: 'loc', short: 'Head hit with blackout or confusion', text: 'Was there a hit to the head with loss of consciousness or confusion?' },
];

const TIERS = {
  emergency: {
    label: 'Get emergency care now',
    time: 'Right now',
    color: '#B42318',
    bg: '#FDECEA',
    Icon: AlertTriangle,
    copy: "One or more answers point to something that needs immediate medical attention. Head to an emergency room or call your campus's emergency line. Don't wait this one out.",
  },
  urgent: {
    label: 'Get seen today',
    time: 'Within hours',
    color: '#B4540A',
    bg: '#FEF0E1',
    Icon: Zap,
    copy: "This pattern is consistent with something that shouldn't wait. Stop playing and get an athletic trainer or urgent care to look at it today.",
  },
  clinician: {
    label: 'See a clinician soon',
    time: 'Next 1 to 2 days',
    color: '#4A3BA8',
    bg: '#ECEAFB',
    Icon: Stethoscope,
    copy: "Worth a proper look, but it doesn't read as an emergency. Book a visit with a doctor or athletic trainer in the next day or two.",
  },
  selfcare: {
    label: 'Likely fine to self-manage',
    time: 'Monitor at home',
    color: '#0B7A5C',
    bg: '#DDFAF1',
    Icon: CircleCheck,
    copy: "Nothing here points to a serious injury. Rest, ice, and keep an eye on it. See a clinician if it isn't improving in a few days or gets worse.",
  },
};

/* ---------------------------------------------------------------
   MATCHING LOGIC
   A rules-based stand-in for the eventual model: scores every
   injury on record for the chosen sport against the mechanism,
   body parts, and reported symptoms, then the red-flag and
   weight-bearing answers set the urgency tier.
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

function scoreInjuries({ sport, moveId, bodyParts, symptoms }) {
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
      if (bodyParts && bodyParts.length > 0 && bodyParts.includes(inj.body_part)) {
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
   PERSISTENCE
   Each finished report is saved to localStorage with everything
   the person entered plus what the matcher returned, so Past
   history can replay exactly what was reported. Re-finishing the
   same report (after going back to edit) updates it in place.
--------------------------------------------------------------- */
const REPORTS_KEY = 'sideline_reports_v1';

function getSavedReports() {
  try {
    const raw = window.localStorage.getItem(REPORTS_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return list.sort((a, b) =>
      new Date(b.savedAt || b.date || 0).getTime() - new Date(a.savedAt || a.date || 0).getTime()
    );
  } catch {
    return [];
  }
}

function upsertReport(record) {
  try {
    const existing = getSavedReports().filter(r => r.id !== record.id);
    existing.unshift(record);
    window.localStorage.setItem(REPORTS_KEY, JSON.stringify(existing));
  } catch {
    // localStorage unavailable (private window, blocked site data): skip saving
  }
}

function clearReports() {
  try {
    window.localStorage.removeItem(REPORTS_KEY);
  } catch {
    // nothing to clear
  }
}

function formatWhen(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleString(undefined, {
    month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit',
  });
}

const ANSWER_LABEL = { yes: 'Yes', no: 'No', unsure: 'Not sure' };

/* ---------------------------------------------------------------
   DESIGN TOKENS + GLOBAL CSS
--------------------------------------------------------------- */
const C = {
  purple: '#5B4BC4',
  purpleDeep: '#4A3BA8',
  ink: '#2B2370',
  muted: '#6B6799',
  mint: '#2EE6B6',
  mintDeep: '#12B58C',
  mintTint: '#DDFAF1',
  lav: '#DAD8F8',
  paper: '#F4F3FC',
  line: '#DCD9F3',
  white: '#FFFFFF',
};

const SHADOW = '0 6px 18px rgba(74,59,168,0.10)';

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
html, body { margin: 0 !important; padding: 0 !important; display: block !important; background: ${C.lav} !important; color-scheme: light; }
#root { width: auto !important; max-width: none !important; margin: 0 !important; border: none !important; text-align: left !important; display: block !important; min-height: 0 !important; }
.sl-outer { min-height: 100vh; display: flex; justify-content: center; align-items: flex-start; padding: 28px 16px; background: ${C.lav}; color: ${C.ink}; font-family: 'Poppins', ui-sans-serif, system-ui, sans-serif; text-align: left; line-height: 1.45; position: relative; overflow: hidden; }
.sl-outer, .sl-outer *, .sl-outer *::before, .sl-outer *::after { box-sizing: border-box; }
.sl-outer button { font-family: inherit; cursor: pointer; }
.sl-outer h1, .sl-outer h2, .sl-outer h3, .sl-outer p { margin: 0; }
.sl-circle { position: fixed; border-radius: 50%; background: rgba(255,255,255,0.5); pointer-events: none; }
.sl-device { position: relative; width: 100%; max-width: 400px; min-height: 760px; border-radius: 36px; background: ${C.paper}; overflow: hidden; box-shadow: 0 24px 60px rgba(74,59,168,0.22); }
.sl-device.splash { background: ${C.purple}; }
.sl-blob { position: absolute; border-radius: 50%; background: ${C.purple}; pointer-events: none; }
.sl-content { position: relative; z-index: 1; padding: 26px 22px 34px; min-height: 760px; display: flex; flex-direction: column; }
@media (max-width: 480px) {
  .sl-outer { padding: 0; }
  .sl-device { max-width: none; border-radius: 0; min-height: 100vh; box-shadow: none; }
  .sl-content { min-height: 100vh; }
}
.sl-press { transition: transform .12s ease, border-color .12s ease, background .12s ease; }
.sl-press:hover { transform: translateY(-1px); }
.sl-outer button:focus-visible, .sl-press:focus-visible { outline: 3px solid ${C.mintDeep}; outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) {
  .sl-press { transition: none; }
  .sl-press:hover { transform: none; }
}
`;

/* ---------------------------------------------------------------
   UI PRIMITIVES
--------------------------------------------------------------- */
function Shell({ children, tone = 'plain' }) {
  return (
    <div className="sl-outer">
      <style>{CSS}</style>
      <div className="sl-circle" style={{ width: 380, height: 380, top: -140, left: -120 }} />
      <div className="sl-circle" style={{ width: 460, height: 460, bottom: -200, right: -160 }} />
      <div className={`sl-device ${tone === 'splash' ? 'splash' : ''}`}>
        {tone === 'home' && (
          <>
            <div className="sl-blob" style={{ width: 270, height: 270, top: 250, right: -100 }} />
            <div className="sl-blob" style={{ width: 320, height: 320, bottom: -130, left: -120 }} />
          </>
        )}
        {tone === 'plain' && (
          <div className="sl-blob" style={{ width: 220, height: 220, top: -90, right: -70, background: '#E7E5FA' }} />
        )}
        <div className="sl-content">{children}</div>
      </div>
    </div>
  );
}

function TopBar({ title, subtitle, onBack }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {onBack ? (
          <button
            aria-label="Back"
            onClick={onBack}
            style={{
              width: 36, height: 36, borderRadius: '50%', border: 'none', padding: 0,
              background: C.white, boxShadow: SHADOW,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <ArrowLeft size={18} color={C.purple} />
          </button>
        ) : (
          <div style={{ width: 36 }} />
        )}
        <h1 style={{ fontSize: 21, fontWeight: 700, color: C.purple, textAlign: 'center' }}>{title}</h1>
        <div style={{ width: 36 }} />
      </div>
      {subtitle && (
        <div style={{ textAlign: 'center', marginTop: 10 }}>
          <p style={{ fontSize: 12.5, color: C.ink, maxWidth: 300, margin: '0 auto' }}>{subtitle}</p>
          <div style={{ width: 34, height: 3, borderRadius: 2, background: C.mint, margin: '8px auto 0' }} />
        </div>
      )}
    </div>
  );
}

function Card({ children, onClick, active, style }) {
  const interactive = !!onClick;
  return (
    <div
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={interactive ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); }
      } : undefined}
      onClick={onClick}
      className={interactive ? 'sl-press' : ''}
      style={{
        background: active ? C.mintTint : C.white,
        border: `2px solid ${active ? C.mintDeep : 'transparent'}`,
        borderRadius: 18, padding: '16px 18px', boxShadow: SHADOW,
        cursor: interactive ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Tile({ icon: Icon, label, onClick }) {
  return (
    <Card
      onClick={onClick}
      style={{
        padding: '22px 12px 18px', textAlign: 'center', minHeight: 132,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
      }}
    >
      <Icon size={38} strokeWidth={1.5} color={C.purple} />
      <div style={{ fontSize: 13.5, fontWeight: 600, color: C.ink }}>{label}</div>
      <div style={{ width: 26, height: 3, borderRadius: 2, background: C.mint }} />
    </Card>
  );
}

const BUTTON_VARIANTS = {
  mint: { background: C.mint, color: C.ink, border: '2px solid transparent' },
  purple: { background: C.purple, color: C.white, border: '2px solid transparent' },
  ghost: { background: C.white, color: C.purple, border: `2px solid ${C.line}` },
  outlineMint: { background: 'transparent', color: C.mint, border: `2px solid ${C.mint}` },
};

function Button({ children, onClick, disabled, variant = 'mint', style }) {
  const v = BUTTON_VARIANTS[variant];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...v,
        ...(disabled ? { background: '#E4E2F5', color: '#8C89B5', border: '2px solid transparent', cursor: 'not-allowed' } : {}),
        width: '100%', borderRadius: 14, padding: '13px 20px', fontSize: 15, fontWeight: 600,
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        ...style,
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
      {opts.map(([v, label]) => {
        const on = value === v;
        return (
          <button
            key={v}
            aria-pressed={on}
            onClick={() => onChange(v)}
            style={{
              flex: 1, padding: '10px 0', borderRadius: 12, fontSize: 13.5, fontWeight: 600,
              border: `2px solid ${on ? C.purple : C.line}`,
              background: on ? C.purple : C.white,
              color: on ? C.white : C.ink,
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

const H2 = { fontSize: 17, fontWeight: 600, color: C.ink, marginBottom: 4 };
const SUB = { fontSize: 12.5, color: C.muted, marginBottom: 16 };

/* ---------------------------------------------------------------
   SCREENS
--------------------------------------------------------------- */
function Welcome({ onStart, onReport }) {
  const marks = [
    { Icon: Plus, top: '4%', left: '8%', size: 28 },
    { Icon: HeartPulse, top: '8%', left: '72%', size: 34 },
    { Icon: Plus, top: '22%', left: '86%', size: 22 },
    { Icon: HeartPulse, top: '30%', left: '-4%', size: 38 },
    { Icon: Plus, top: '56%', left: '88%', size: 28 },
    { Icon: HeartPulse, top: '52%', left: '2%', size: 30 },
  ];
  return (
    <Shell tone="splash">
      {marks.map(({ Icon, top, left, size }, i) => (
        <Icon
          key={i}
          aria-hidden="true"
          size={size}
          strokeWidth={1.4}
          color={C.mint}
          style={{ position: 'absolute', top, left, opacity: 0.35, pointerEvents: 'none' }}
        />
      ))}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', padding: '40px 0' }}>
        <div style={{
          width: 64, height: 64, borderRadius: 20, background: C.mint, margin: '0 auto 12px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <HeartPulse size={34} color={C.ink} />
        </div>
        <div style={{ fontSize: 18, fontWeight: 600, color: C.white, marginBottom: 26 }}>Sideline</div>
        <h1 style={{ fontSize: 34, fontWeight: 700, color: C.white, lineHeight: 1.15 }}>
          Find out what your injury needs
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', maxWidth: 280, margin: '14px auto 0' }}>
          Describe what happened and how it feels. Get a first read on how urgent it is.
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Button variant="mint" onClick={onStart}>Get started</Button>
        <Button variant="outlineMint" onClick={onReport}>Report an injury</Button>
        <p style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.75)', textAlign: 'center', marginTop: 6 }}>
          Not a diagnosis. A starting point before you see a clinician.
        </p>
      </div>
    </Shell>
  );
}

function Home({ go, onBack }) {
  return (
    <Shell tone="home">
      <TopBar
        title="Sideline"
        subtitle="Answer a few questions about what happened and how it feels to get a sense of how serious it might be."
        onBack={onBack}
      />

      <Card
        onClick={() => go('report')}
        style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 18, marginBottom: 16 }}
      >
        <div style={{
          width: 48, height: 48, borderRadius: 16, background: C.mint, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Plus size={26} color={C.ink} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 600 }}>Report an injury</div>
          <div style={{ fontSize: 12.5, color: C.muted }}>Takes about two minutes</div>
        </div>
        <ChevronRight size={20} color={C.purple} />
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <Tile icon={History} label="Past history" onClick={() => go('history')} />
        <Tile icon={RotateCcw} label="Return to play" onClick={() => go('return')} />
        <Tile icon={User} label="My data" onClick={() => go('data')} />
        <Tile icon={ShieldAlert} label="Emergency" onClick={() => go('emergency')} />
      </div>

      <div style={{ flex: 1, minHeight: 20 }} />

      <Card style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '14px 16px' }}>
        <Info size={16} color={C.purple} style={{ marginTop: 2, flexShrink: 0 }} />
        <p style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.5 }}>
          Not a diagnosis. Sideline gives a starting point built from reported injury patterns.
          A licensed clinician makes the actual call.
        </p>
      </Card>
    </Shell>
  );
}

function Placeholder({ title, desc, onBack }) {
  return (
    <Shell>
      <TopBar title={title} onBack={onBack} />
      <Card style={{ padding: '28px 22px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', width: 44, height: 44, borderRadius: '50%',
          background: C.mintTint, alignItems: 'center', justifyContent: 'center', marginBottom: 12,
        }}>
          <Info size={20} color={C.mintDeep} />
        </div>
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Coming soon</div>
        <div style={{ fontSize: 13, color: C.muted, maxWidth: 300, margin: '0 auto' }}>{desc}</div>
      </Card>
    </Shell>
  );
}

const PLACEHOLDER_COPY = {
  return: 'Once an injury is logged, this will track your recovery day by day against the expected timeline.',
  data: 'A body map showing where you’ve been hurt over time, built from your reported injuries.',
};

function EmergencyScreen({ onBack }) {
  return (
    <Shell>
      <TopBar
        title="Emergency"
        subtitle="If any of these are true, stop playing and get help right away."
        onBack={onBack}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
        {RED_FLAGS.map(f => (
          <Card key={f.key} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '14px 16px' }}>
            <AlertTriangle size={20} color={TIERS.emergency.color} style={{ flexShrink: 0 }} />
            <div style={{ fontSize: 13.5, fontWeight: 500 }}>{f.text}</div>
          </Card>
        ))}
      </div>
      <div style={{ background: TIERS.emergency.bg, borderRadius: 18, padding: '16px 18px' }}>
        <div style={{ fontSize: 14.5, fontWeight: 600, color: TIERS.emergency.color, marginBottom: 4 }}>
          Go to an emergency room or call 911
        </div>
        <p style={{ fontSize: 13, color: C.ink }}>
          You can also call your campus emergency line. Don't wait to see if it settles down.
        </p>
      </div>
    </Shell>
  );
}

/* ---------------------------------------------------------------
   REPORT FLOW
--------------------------------------------------------------- */
function ReportFlow({ onExit, onHistory }) {
  const [step, setStep] = useState(0);
  const [sport, setSport] = useState(null);
  const [redFlags, setRedFlags] = useState({});
  const [moveId, setMoveId] = useState(null);
  const [selectedBodyParts, setSelectedBodyParts] = useState([]);
  const [weightBearing, setWeightBearing] = useState(null);
  const [symptoms, setSymptoms] = useState({});

  const moves = useMemo(() => (sport ? movesForSport(sport) : []), [sport]);
  const bodyPartOptions = useMemo(() => (sport ? bodyPartsForSport(sport) : []), [sport]);
  const redFlagTriggered = Object.values(redFlags).some(v => v === 'yes');

  const toggleBodyPart = (bp) => {
    setSelectedBodyParts(prev => (prev.includes(bp) ? prev.filter(x => x !== bp) : [...prev, bp]));
  };

  const results = useMemo(() => {
    if (!sport || redFlagTriggered) return [];
    return scoreInjuries({ sport, moveId, bodyParts: selectedBodyParts, symptoms });
  }, [sport, moveId, selectedBodyParts, symptoms, redFlagTriggered]);

  const tierKey = useMemo(() => {
    if (!sport) return null;
    return decideTier({ redFlags, weightBearing, topMatch: results[0] });
  }, [redFlags, weightBearing, results, sport]);

  // Save (or update) this report each time the results screen is reached.
  const savedIdRef = useRef(null);
  useEffect(() => {
    if (step !== 4 || !tierKey) return;
    if (!savedIdRef.current) savedIdRef.current = Date.now();
    const move = moves.find(m => m.move_id === moveId);
    upsertReport({
      id: savedIdRef.current,
      savedAt: new Date().toISOString(),
      sport,
      moveId,
      moveName: move ? move.move_name : null,
      bodyParts: selectedBodyParts,
      symptoms,
      weightBearing,
      redFlags,
      redFlagTriggered,
      tier: tierKey,
      matches: results.map(r => ({
        name: r.injury_name,
        bodyPart: r.body_part,
        severity: r.severity ? r.severity.severity : null,
        recoveryWeeks: r.severity ? r.severity.recovery_time_avg : null,
      })),
    });
  }, [step]);

  const STEPS = ['sport', 'redflags', 'mechanism', 'symptoms', 'results'];
  const total = STEPS.length - 1;

  const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const back = () => {
    if (step === 0) onExit();
    else if (step === 4 && redFlagTriggered) setStep(1);
    else setStep(s => s - 1);
  };

  const allRedFlagsAnswered = RED_FLAGS.every(f => redFlags[f.key]);
  const allSymptomsAnswered = SYMPTOM_FIELDS.every(f => symptoms[f.key]) && weightBearing;

  return (
    <Shell>
      <TopBar title="Report an injury" onBack={back} />

      {step < 4 && (
        <div style={{ marginBottom: 22 }}>
          <div style={{ display: 'flex', gap: 5 }}>
            {Array.from({ length: total }).map((_, i) => (
              <div key={i} style={{ height: 5, flex: 1, borderRadius: 3, background: i <= step ? C.purple : '#D9D6F2' }} />
            ))}
          </div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 6, textAlign: 'center' }}>
            Step {step + 1} of {total}
          </div>
        </div>
      )}

      {step === 0 && (
        <div>
          <h2 style={{ ...H2, marginBottom: 14 }}>Which sport?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {SPORTS.map(s => {
              const meta = SPORT_META[s];
              const Icon = meta.icon;
              return (
                <Card
                  key={s}
                  active={sport === s}
                  onClick={() => { setSport(s); setStep(1); }}
                  style={{ textAlign: 'center', padding: '20px 12px' }}
                >
                  <Icon size={30} strokeWidth={1.5} color={C.purple} />
                  <div style={{ fontSize: 15, fontWeight: 600, marginTop: 8 }}>{s}</div>
                  <div style={{ fontSize: 11.5, color: C.muted, marginTop: 2 }}>{meta.blurb}</div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {step === 1 && (
        <div>
          <h2 style={H2}>Quick safety check</h2>
          <p style={SUB}>Answer these first. They matter more than anything else.</p>
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
          <Button
            disabled={!allRedFlagsAnswered}
            onClick={() => {
              if (Object.values(redFlags).some(v => v === 'yes')) setStep(4);
              else next();
            }}
          >
            Continue <ArrowRight size={16} />
          </Button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 style={H2}>What were you doing?</h2>
          <p style={SUB}>Pick the closest match to what you were doing when it happened.</p>
          <div style={{
            display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22,
            maxHeight: 300, overflowY: 'auto', padding: '4px 4px 8px', margin: '0 -4px 18px',
          }}>
            {moves.map(m => {
              const on = moveId === m.move_id;
              return (
                <Card
                  key={m.move_id}
                  active={on}
                  onClick={() => setMoveId(m.move_id)}
                  style={{ padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 12 }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{m.move_name}</div>
                    <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{m.move_description}</div>
                  </div>
                  {on && (
                    <div style={{
                      width: 24, height: 24, borderRadius: '50%', background: C.mint, flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Check size={15} color={C.ink} strokeWidth={3} />
                    </div>
                  )}
                </Card>
              );
            })}
          </div>

          <h2 style={H2}>Where does it hurt?</h2>
          <p style={{ ...SUB, marginBottom: 10 }}>Select all that apply.</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 22 }}>
            {bodyPartOptions.map(bp => {
              const on = selectedBodyParts.includes(bp);
              return (
                <button
                  key={bp}
                  aria-pressed={on}
                  onClick={() => toggleBodyPart(bp)}
                  style={{
                    padding: '9px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    border: `2px solid ${on ? C.purple : C.line}`,
                    background: on ? C.purple : C.white,
                    color: on ? C.white : C.ink,
                  }}
                >
                  {on && <Check size={13} strokeWidth={3} />}
                  {bp}
                </button>
              );
            })}
          </div>

          <Button disabled={!moveId || selectedBodyParts.length === 0} onClick={next}>
            Continue <ArrowRight size={16} />
          </Button>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 style={H2}>How does it feel?</h2>
          <p style={SUB}>"Not sure" is a fine answer. It's better than guessing.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 18 }}>
            {SYMPTOM_FIELDS.map(f => (
              <Card key={f.key} style={{ padding: '14px 16px' }}>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{f.label}</div>
                <div style={{ fontSize: 11.5, color: C.muted, marginBottom: 10 }}>{f.hint}</div>
                <YesNoUnsure value={symptoms[f.key]} onChange={v => setSymptoms(s => ({ ...s, [f.key]: v }))} />
              </Card>
            ))}
            <Card style={{ padding: '14px 16px', border: `2px solid ${C.line}` }}>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>Can you bear weight on it or keep playing right now?</div>
              <div style={{ fontSize: 11.5, color: C.muted, marginBottom: 10 }}>
                Be honest. Pushing through matters here.
              </div>
              <YesNoUnsure value={weightBearing} onChange={setWeightBearing} />
            </Card>
          </div>
          <Button disabled={!allSymptomsAnswered} onClick={next}>
            See what it might be <ArrowRight size={16} />
          </Button>
        </div>
      )}

      {step === 4 && tierKey && (
        <ResultsScreen
          tierKey={tierKey}
          redFlagTriggered={redFlagTriggered}
          results={results}
          onHistory={onHistory}
          onRestart={() => {
            savedIdRef.current = null;
            setStep(0); setSport(null); setRedFlags({}); setMoveId(null);
            setSelectedBodyParts([]); setWeightBearing(null); setSymptoms({});
          }}
          onExit={onExit}
        />
      )}
    </Shell>
  );
}

function ResultsScreen({ tierKey, redFlagTriggered, results, onRestart, onExit, onHistory }) {
  const tier = TIERS[tierKey];
  const Icon = tier.Icon;

  return (
    <div>
      <div style={{ background: tier.bg, borderRadius: 18, padding: 18, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 14, background: tier.color, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon size={22} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 700, color: tier.color, lineHeight: 1.2 }}>{tier.label}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: tier.color }}>{tier.time}</div>
          </div>
        </div>
        <p style={{ fontSize: 13.5, color: C.ink, lineHeight: 1.55 }}>{tier.copy}</p>
      </div>

      {!redFlagTriggered && results.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <h2 style={H2}>What it could be</h2>
          <p style={{ ...SUB, marginBottom: 12 }}>Ranked by how well it matches what you described. Not a diagnosis.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {results.map((r, idx) => (
              <Card key={r.injury_id} style={{ padding: '15px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                  <div style={{ fontSize: 15, fontWeight: 600 }}>{r.injury_name}</div>
                  {idx === 0 && (
                    <div style={{ fontSize: 11, fontWeight: 600, color: C.ink, background: C.mint, padding: '2px 10px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                      Closest match
                    </div>
                  )}
                </div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{r.body_part}</div>

                {r.severity && (
                  <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                    <div style={{ fontSize: 12, background: '#ECEAFB', borderRadius: 10, padding: '3px 10px' }}>
                      Typical severity: <b>{r.severity.severity}</b>
                    </div>
                    <div style={{ fontSize: 12, background: '#ECEAFB', borderRadius: 10, padding: '3px 10px' }}>
                      Recovery: <b>~{r.severity.recovery_time_avg} wk</b>
                    </div>
                  </div>
                )}
                {r.reasons.length > 0 && (
                  <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {r.reasons.slice(0, 3).map((reason, i) => (
                      <div key={i} style={{ display: 'flex', gap: 6, fontSize: 12, color: C.ink }}>
                        <Check size={13} color={C.mintDeep} strokeWidth={3} style={{ marginTop: 2, flexShrink: 0 }} />
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
        <p style={{ fontSize: 13, color: C.muted, marginBottom: 20 }}>
          Nothing on file matched closely. That's not unusual, and it doesn't mean it's nothing.
          Use the guidance above either way.
        </p>
      )}

      <Card style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', marginBottom: 16 }}>
        <CircleCheck size={20} color={C.mintDeep} style={{ flexShrink: 0 }} />
        <div style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>Saved to Past history</div>
        <button
          onClick={onHistory}
          style={{ background: 'none', border: 'none', color: C.purple, fontWeight: 600, fontSize: 13, padding: 4 }}
        >
          View
        </button>
      </Card>

      <p style={{ fontSize: 11.5, color: C.muted, lineHeight: 1.5, marginBottom: 18 }}>
        This is not a diagnosis. It's built from patterns in reported injuries to give you a
        starting point. A licensed clinician makes the actual call.
      </p>

      <div style={{ display: 'flex', gap: 10 }}>
        <Button variant="ghost" onClick={onRestart}>Report another</Button>
        <Button variant="purple" onClick={onExit}>Done</Button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   PAST HISTORY
--------------------------------------------------------------- */
function DetailRow({ label, value, flag }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, padding: '5px 0' }}>
      <div style={{ fontSize: 12.5 }}>{label}</div>
      <div style={{
        fontSize: 11.5, fontWeight: 600, borderRadius: 10, padding: '2px 10px', whiteSpace: 'nowrap',
        background: flag ? TIERS.emergency.bg : '#ECEAFB',
        color: flag ? TIERS.emergency.color : C.ink,
      }}>
        {value}
      </div>
    </div>
  );
}

function DetailSection({ title, children }) {
  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: C.purple, marginBottom: 4 }}>{title}</div>
      {children}
    </div>
  );
}

function ReportCard({ r }) {
  const [open, setOpen] = useState(false);
  const tier = TIERS[r.tier];
  const when = formatWhen(r.savedAt || r.date);
  const matches = r.matches || (r.topInjury ? [{ name: r.topInjury }] : []);
  const top = matches[0];
  const hasDetail = !!(r.symptoms || r.redFlags);
  const flagged = r.redFlags ? RED_FLAGS.filter(f => r.redFlags[f.key] === 'yes') : [];

  return (
    <Card style={{ padding: 0 }}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        style={{
          width: '100%', background: 'none', border: 'none', textAlign: 'left',
          padding: '15px 16px', color: 'inherit', display: 'block',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{r.sport}</div>
            {r.bodyParts && r.bodyParts.length > 0 && (
              <div style={{ fontSize: 12, color: C.muted }}>{r.bodyParts.join(', ')}</div>
            )}
          </div>
          <ChevronDown
            size={18}
            color={C.purple}
            style={{ flexShrink: 0, marginTop: 2, transform: open ? 'rotate(180deg)' : 'none' }}
          />
        </div>
        {when && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: C.muted, marginTop: 6 }}>
            <Clock size={12} /> Saved {when}
          </div>
        )}
        {top && top.name && (
          <div style={{ fontSize: 13, marginTop: 8 }}>
            Closest match: <b>{top.name}</b>
          </div>
        )}
        {tier && (
          <div style={{
            display: 'inline-block', marginTop: 10, fontSize: 11.5, fontWeight: 600,
            color: tier.color, background: tier.bg, padding: '3px 10px', borderRadius: 20,
          }}>
            {tier.label}
          </div>
        )}
      </button>

      {open && (
        <div style={{ padding: '0 16px 16px', borderTop: `1px solid ${C.line}` }}>
          {!hasDetail && (
            <p style={{ fontSize: 12.5, color: C.muted, marginTop: 12 }}>
              This report was saved before full details were recorded, so only the summary is available.
            </p>
          )}

          {r.moveName && (
            <DetailSection title="What you were doing">
              <div style={{ fontSize: 13 }}>{r.moveName}</div>
            </DetailSection>
          )}

          {r.bodyParts && r.bodyParts.length > 0 && (
            <DetailSection title="Where it hurt">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {r.bodyParts.map(bp => (
                  <span key={bp} style={{ fontSize: 12, background: '#ECEAFB', borderRadius: 12, padding: '3px 10px' }}>{bp}</span>
                ))}
              </div>
            </DetailSection>
          )}

          {r.redFlags && (
            <DetailSection title="Safety check">
              {flagged.length > 0 && (
                <p style={{ fontSize: 12.5, color: TIERS.emergency.color, fontWeight: 600, margin: '2px 0 4px' }}>
                  Flagged: {flagged.map(f => f.short.toLowerCase()).join(', ')}
                </p>
              )}
              {RED_FLAGS.map(f => (
                <DetailRow
                  key={f.key}
                  label={f.short}
                  value={ANSWER_LABEL[r.redFlags[f.key]] || 'Not answered'}
                  flag={r.redFlags[f.key] === 'yes'}
                />
              ))}
            </DetailSection>
          )}

          {r.symptoms && (
            <DetailSection title="How it felt">
              {SYMPTOM_FIELDS.map(f => (
                <DetailRow
                  key={f.key}
                  label={f.label}
                  value={ANSWER_LABEL[r.symptoms[f.key]] || 'Not answered'}
                />
              ))}
              <DetailRow
                label="Could bear weight"
                value={ANSWER_LABEL[r.weightBearing] || 'Not answered'}
              />
            </DetailSection>
          )}

          {matches.length > 0 && (
            <DetailSection title="What it could be">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {matches.map((m, i) => (
                  <div key={i} style={{ background: C.paper, borderRadius: 12, padding: '9px 12px' }}>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{m.name}</div>
                    {(m.bodyPart || m.severity) && (
                      <div style={{ fontSize: 11.5, color: C.muted }}>
                        {[m.bodyPart, m.severity && `${m.severity} typical`, m.recoveryWeeks != null && `~${m.recoveryWeeks} wk recovery`]
                          .filter(Boolean).join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </DetailSection>
          )}

          {r.redFlagTriggered && matches.length === 0 && (
            <DetailSection title="What it could be">
              <p style={{ fontSize: 12.5, color: C.muted }}>
                The safety check flagged this, so the report went straight to emergency guidance without matching injuries.
              </p>
            </DetailSection>
          )}
        </div>
      )}
    </Card>
  );
}

function HistoryScreen({ onBack, onReport }) {
  const [reports, setReports] = useState(() => getSavedReports());
  const [confirmClear, setConfirmClear] = useState(false);
  const lastSaved = reports.length ? formatWhen(reports[0].savedAt || reports[0].date) : '';

  return (
    <Shell>
      <TopBar
        title="Past history"
        subtitle="Every finished report is saved on this device with the date, time, and everything you entered."
        onBack={onBack}
      />

      {reports.length === 0 ? (
        <Card style={{ padding: '28px 22px', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', width: 44, height: 44, borderRadius: '50%',
            background: C.mintTint, alignItems: 'center', justifyContent: 'center', marginBottom: 12,
          }}>
            <History size={20} color={C.mintDeep} />
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>No reports yet</div>
          <p style={{ fontSize: 13, color: C.muted, maxWidth: 280, margin: '0 auto 16px' }}>
            Finish an injury report and it will show up here with what you were doing, how it felt, and what it could be.
          </p>
          <Button onClick={onReport}>Report an injury</Button>
        </Card>
      ) : (
        <>
          <p style={{ fontSize: 12.5, color: C.muted, marginBottom: 12, textAlign: 'center' }}>
            {reports.length} {reports.length === 1 ? 'report' : 'reports'} saved. Last saved {lastSaved}.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {reports.map(r => <ReportCard key={r.id} r={r} />)}
          </div>
          {confirmClear ? (
            <div style={{ display: 'flex', gap: 10 }}>
              <Button variant="ghost" onClick={() => setConfirmClear(false)}>Keep history</Button>
              <Button
                variant="purple"
                onClick={() => { clearReports(); setReports([]); setConfirmClear(false); }}
              >
                <Trash2 size={15} /> Clear all
              </Button>
            </div>
          ) : (
            <Button variant="ghost" onClick={() => setConfirmClear(true)}>
              <Trash2 size={15} /> Clear history
            </Button>
          )}
        </>
      )}
    </Shell>
  );
}

/* ---------------------------------------------------------------
   ROOT
--------------------------------------------------------------- */
export default function SidelineApp() {
  const [screen, setScreen] = useState('welcome');
  const home = () => setScreen('home');

  if (screen === 'welcome') {
    return <Welcome onStart={home} onReport={() => setScreen('report')} />;
  }
  if (screen === 'report') {
    return <ReportFlow onExit={home} onHistory={() => setScreen('history')} />;
  }
  if (screen === 'history') {
    return <HistoryScreen onBack={home} onReport={() => setScreen('report')} />;
  }
  if (screen === 'emergency') {
    return <EmergencyScreen onBack={home} />;
  }
  if (screen in PLACEHOLDER_COPY) {
    const titles = { return: 'Return to play', data: 'My data' };
    return <Placeholder title={titles[screen]} desc={PLACEHOLDER_COPY[screen]} onBack={home} />;
  }
  return <Home go={setScreen} onBack={() => setScreen('welcome')} />;
}
