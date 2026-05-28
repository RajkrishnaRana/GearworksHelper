import { useState } from "react";

export default function useGearCalculator() {
    const [gearType, setGearType] = useState("straight");
    const [outDia, setOutDia] = useState("");
    const [module, setModule] = useState("");
    const [teeth, setTeeth] = useState("");
    const [cutterType, setCutterType] = useState("module");
    const [angle, setAngle] = useState("");

    const calculate = () => {
        const hasOD = outDia.trim() !== "" && !isNaN(parseFloat(outDia));
        const hasM = module.trim() !== "" && !isNaN(parseFloat(module));
        const hasT = teeth.trim() !== "" && !isNaN(parseFloat(teeth));
        const hasA = angle.trim() !== "" && !isNaN(parseFloat(angle));

        const OD = parseFloat(outDia);
        const m = parseFloat(module);
        const t = parseFloat(teeth);
        const aRad = hasA ? parseFloat(angle) * (Math.PI / 180) : 0;
        const cosA = Math.cos(aRad);

        if (gearType === "straight") {
            if (!hasOD && hasM && hasT) {
                if (cutterType === "module") setOutDia(((t + 2) * m).toFixed(3));
                else if (cutterType === "dp") setOutDia((((t + 2) / m) * 25.4).toFixed(3));
            } else if (!hasM && hasOD && hasT) {
                if (cutterType === "module") setModule((OD / (t + 2)).toFixed(3));
                else if (cutterType === "dp") setModule((((t + 2) / OD) * 25.4).toFixed(3));
            } else if (!hasT && hasOD && hasM) {
                if (cutterType === "module") setTeeth((OD / m - 2).toFixed(3));
                else if (cutterType === "dp") setTeeth(((OD * m / 25.4) - 2).toFixed(3));
            }
        } else if (gearType === "helical") {
            if (!hasOD && hasM && hasT && hasA) {
                if (cutterType === "module") setOutDia(((t * m / cosA) + m * 2).toFixed(3));
                else if (cutterType === "dp") setOutDia((((t / m / cosA) + (2 / m)) * 25.4).toFixed(3));
            } else if (!hasM && hasOD && hasT && hasA) {
                if (cutterType === "module") setModule((OD / (t / cosA + 2)).toFixed(3));
                else if (cutterType === "dp") setModule(((t / cosA + 2) * 25.4 / OD).toFixed(3));
            } else if (!hasT && hasOD && hasM && hasA) {
                if (cutterType === "module") setTeeth(((OD - 2 * m) * cosA / m).toFixed(3));
                else if (cutterType === "dp") setTeeth(((OD * m / 25.4 - 2) * cosA).toFixed(3));
            } else if (!hasA && hasOD && hasM && hasT) {
                if (cutterType === "module") {
                    const cosVal = (t * m) / (OD - 2 * m);
                    if (cosVal >= -1 && cosVal <= 1) {
                        setAngle((Math.acos(cosVal) * (180 / Math.PI)).toFixed(3));
                    } else {
                        alert("Invalid inputs: Cannot calculate angle.");
                    }
                } else if (cutterType === "dp") {
                    const cosVal = (t / m) / (OD / 25.4 - 2 / m);
                    if (cosVal >= -1 && cosVal <= 1) {
                        setAngle((Math.acos(cosVal) * (180 / Math.PI)).toFixed(3));
                    } else {
                        alert("Invalid inputs: Cannot calculate angle.");
                    }
                }
            }
        }
    };

    return {
        gearType,
        setGearType,
        outDia,
        module,
        teeth,
        setOutDia,
        setModule,
        setTeeth,
        cutterType,
        setCutterType,
        angle,
        setAngle,
        calculate,
    };
}
