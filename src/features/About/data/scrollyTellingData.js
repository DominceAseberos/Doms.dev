import AnimatedGlobe from '../components/ui/AnimatedGlobe';
import JoyOfCodingViz from '../components/ui/JoyOfCodingViz';
import ComplexSystemsViz from '../components/ui/ComplexSystemsViz';
import EndgameViz from '../components/ui/EndgameViz';

export const ABOUT_SEQUENCES = [
    {
        id: 'scene-1-student',
        text: "I am Domince, a 3rd year Computer Science student at the University of Mindanao Tagum College.",
        highlights: ['3rd', 'year', 'Computer', 'Science'],
        VizComponent: AnimatedGlobe,
        vizNeedsTriggerRef: true // AnimatedGlobe requires the triggerRef to sync its internal zoom
    },
    {
        id: 'scene-2-adrenaline-complex',
        text: "For me, the true joy of coding is the sheer adrenaline of finally solving a problem after countless failures.|||While I build web apps today, it's just a stepping stone to master far more complex systems.",
        highlights: ['adrenaline', 'countless', 'failures', 'stepping', 'stone', 'complex', 'systems'],
        VizComponent: JoyOfCodingViz, // We will update JoyOfCodingViz to also render ComplexSystemsViz
    },
    {
        id: 'scene-4-endgame',
        text: "My nights and weekends are spent exploring new concepts, building personal projects, and chasing an ultimate goal: engineering software so impactful that it seamlessly becomes a part of people's daily lives.",
        highlights: ['impactful', 'daily', 'lives'],
        VizComponent: EndgameViz,
    }
];
