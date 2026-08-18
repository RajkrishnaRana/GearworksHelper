import { useState } from "react";

export default function useWheelCalculator() {
    const [cutterType, setCutterType] = useState("pitch");
    const [cutterValue, setCutterValue] = useState("");
    const [wormDia, setWormDia] = useState("");
    const [starts, setStarts] = useState("");
    const [teeth, setTeeth] = useState("");
    const [outDia, setOutDia] = useState("");
    const [throatDia, setThroatDia] = useState("");
    const [wheelAngle, setWheelAngle] = useState("");

    const calculate = () => {
        const val = parseFloat(cutterValue);
        const tdInput = parseFloat(throatDia);
        const odInput = parseFloat(outDia);
        const z = parseFloat(teeth);
        const dw = parseFloat(wormDia);
        const s = parseFloat(starts);

        const hasVal = cutterValue.trim() !== "" && !isNaN(val);
        const hasTD = throatDia.trim() !== "" && !isNaN(tdInput);
        const hasOD = outDia.trim() !== "" && !isNaN(odInput);
        const hasZ = teeth.trim() !== "" && !isNaN(z);
        const hasDW = wormDia.trim() !== "" && !isNaN(dw);
        const hasStarts = starts.trim() !== "" && !isNaN(s);

        const getP_eff = () => {
            if (cutterType === "pitch") return (val * 25.4) / Math.PI;
            if (cutterType === "module") return val;
            if (cutterType === "dp") return val !== 0 ? 25.4 / val : 0;
            return 0;
        };

        const convertP_effToCutter = (pEff: number) => {
            if (pEff === 0) return 0;
            if (cutterType === "pitch") return (pEff * Math.PI) / 25.4;
            if (cutterType === "module") return pEff;
            if (cutterType === "dp") return 25.4 / pEff;
            return 0;
        };

        let calculatedSomething = false;

        if (hasVal && hasZ) {
            const pEff = getP_eff();
            const td = (z + 2) * pEff;
            const od = (z + 3) * pEff;
            setThroatDia(td.toFixed(3));
            setOutDia(od.toFixed(3));
            calculatedSomething = true;
        } else if (hasVal && hasOD && !hasZ) {
            const pEff = getP_eff();
            if (pEff !== 0) {
                const computedZ = odInput / pEff - 3;
                setTeeth(computedZ.toFixed(3));
                const td = (computedZ + 2) * pEff;
                setThroatDia(td.toFixed(3));
                calculatedSomething = true;
            }
        } else if (hasVal && hasTD && !hasZ) {
            const pEff = getP_eff();
            if (pEff !== 0) {
                const computedZ = tdInput / pEff - 2;
                setTeeth(computedZ.toFixed(3));
                const od = (computedZ + 3) * pEff;
                setOutDia(od.toFixed(3));
                calculatedSomething = true;
            }
        } else if (hasOD && hasZ && !hasVal) {
            if (z + 3 !== 0) {
                const pEff = odInput / (z + 3);
                const td = (z + 2) * pEff;
                setThroatDia(td.toFixed(3));
                setCutterValue(convertP_effToCutter(pEff).toFixed(3));
                calculatedSomething = true;
            }
        } else if (hasTD && hasZ && !hasVal) {
            if (z + 2 !== 0) {
                const pEff = tdInput / (z + 2);
                const od = (z + 3) * pEff;
                setOutDia(od.toFixed(3));
                setCutterValue(convertP_effToCutter(pEff).toFixed(3));
                calculatedSomething = true;
            }
        } else if (hasTD && hasOD && !hasVal && !hasZ) {
            const pEff = odInput - tdInput;
            if (pEff > 0) {
                const computedZ = tdInput / pEff - 2;
                setTeeth(computedZ.toFixed(3));
                setCutterValue(convertP_effToCutter(pEff).toFixed(3));
                calculatedSomething = true;
            }
        }

        if (hasVal && hasDW && hasStarts) {
            // 1. getP_eff() reliably gives us the Module in mm for all cutter types
            const module = getP_eff();

            if (module > 0) {
                // 2. In metric, Addendum exactly equals the Module
                const addendum = module;

                // 3. Calculate Pitch Circle Diameter (v) in mm
                const v = dw - addendum * 2;

                // 4. Calculate Pitch Circumference (V) in mm
                const V = v * Math.PI;

                // 5. Calculate Lead in mm (Pitch * Starts)
                const pitchInMm = module * Math.PI;
                const lead = pitchInMm * s;

                // 6. Calculate Angle
                const angleRadians = Math.atan(lead / V);
                const angleDegrees = angleRadians * (180 / Math.PI);

                // 7. Format to Degrees and Minutes
                const degrees = Math.floor(angleDegrees);
                const decimalPart = angleDegrees - degrees;
                let minutes = Math.round(decimalPart * 60);

                // Edge case safety: If minutes round up to 60, bump the degree
                let finalDegrees = degrees;
                if (minutes === 60) {
                    finalDegrees += 1;
                    minutes = 0;
                }

                setWheelAngle(`${finalDegrees}° ${minutes}'`);
                calculatedSomething = true;
            }
        }

        if (!calculatedSomething) {
            alert("Please provide the required missing values to calculate.");
        }
    };

    return {
        cutterType,
        setCutterType,
        cutterValue,
        setCutterValue,
        wormDia,
        setWormDia,
        starts,
        setStarts,
        teeth,
        setTeeth,
        outDia,
        setOutDia,
        throatDia,
        setThroatDia,
        wheelAngle,
        setWheelAngle,
        calculate,
    };
}
