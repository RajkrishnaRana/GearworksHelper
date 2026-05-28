import { useState } from "react";

export default function useGearCalculator() {
    const [gearType, setGearType] = useState("straight");
    const [outDia, setOutDia] = useState("");
    const [module, setModule] = useState("");
    const [teeth, setTeeth] = useState("");
    const [cutterType, setCutterType] = useState("module");

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
    }
}