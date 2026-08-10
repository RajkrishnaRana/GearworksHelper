import { useState } from "react";

export default function useWheelCalculator() {
    const [pitch, setPitch] = useState("");
    const [wormDia, setWormDia] = useState("");
    const [teeth, setTeeth] = useState("");
    const [outDia, setOutDia] = useState("");
    const [wheelAngle, setWheelAngle] = useState("");

    const calculate = () => {
        const p = parseFloat(pitch);
        const dw = parseFloat(wormDia);
        const z = parseFloat(teeth);

        const hasP = pitch.trim() !== "" && !isNaN(p);
        const hasDW = wormDia.trim() !== "" && !isNaN(dw);
        const hasZ = teeth.trim() !== "" && !isNaN(z);

        if (hasP && hasZ) {
            const m = (p * 25.4) / Math.PI;
            const pd = z * m;
            const od = pd + 2 * m;
            setOutDia(od.toFixed(3));
        }
    };

    return {
        pitch,
        setPitch,
        wormDia,
        setWormDia,
        teeth,
        setTeeth,
        outDia,
        setOutDia,
        wheelAngle,
        setWheelAngle,
        calculate,
    };
}
