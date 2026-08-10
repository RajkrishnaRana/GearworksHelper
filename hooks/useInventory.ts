import { useState } from 'react';
import { database } from '@/db';
import { Cutter, Machine, MachineChangeGear } from '@/db/models';
import { withObservables } from '@nozbe/watermelondb/react';
import { Q } from '@nozbe/watermelondb';

export type InventoryFilter = 'all' | 'machine' | 'cutter';

export function useInventory() {
    const [filter, setFilter] = useState<InventoryFilter>('all');
    const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);

    const addCutter = async (data: {
        cutterName: string;
        angle: string;
        hand: string;
        pitch: number;
        bore: number;
        deep: number;
        starts: number;
        pressureAngle: number;
        cutterType: string;
        diameter?: number;
        notes?: string;
    }) => {
        await database.write(async () => {
            await database.get<Cutter>('cutters').create((cutter) => {
                cutter.cutterName = data.cutterName;
                cutter.angle = data.angle;
                cutter.hand = data.hand;
                cutter.pitch = data.pitch;
                cutter.bore = data.bore;
                cutter.deep = data.deep;
                cutter.starts = data.starts;
                cutter.pressureAngle = data.pressureAngle;
                cutter.cutterType = data.cutterType;
                cutter.diameter = data.diameter;
                cutter.notes = data.notes;
                cutter.createdAt = Date.now();
            });
        });
    };

    const updateCutter = async (id: string, data: {
        cutterName: string;
        angle: string;
        hand: string;
        pitch: number;
        bore: number;
        deep: number;
        starts: number;
        pressureAngle: number;
        cutterType: string;
        diameter?: number;
        notes?: string;
    }) => {
        await database.write(async () => {
            const cutter = await database.get<Cutter>('cutters').find(id);
            await cutter.update((c) => {
                c.cutterName = data.cutterName;
                c.angle = data.angle;
                c.hand = data.hand;
                c.pitch = data.pitch;
                c.bore = data.bore;
                c.deep = data.deep;
                c.starts = data.starts;
                c.pressureAngle = data.pressureAngle;
                c.cutterType = data.cutterType;
                c.diameter = data.diameter;
                c.notes = data.notes;
            });
        });
    };
    const addMachine = async (data: {
        name: string;
        indexingRatio: number;
        status?: string;
    }) => {
        await database.write(async () => {
            await database.get<Machine>('machines').create((machine) => {
                machine.name = data.name;
                machine.indexingRatio = data.indexingRatio;
                machine.status = data.status || 'active';
                machine.isActive = true;
            });
        });
    };

    const updateMachine = async (id: string, data: {
        name: string;
        indexingRatio: number;
        status?: string;
    }) => {
        await database.write(async () => {
            const machine = await database.get<Machine>('machines').find(id);
            await machine.update((m) => {
                m.name = data.name;
                m.indexingRatio = data.indexingRatio;
                m.status = data.status || 'active';
            });
        });
    };

    const saveMachineWithGears = async (
        machineId: string | undefined,
        machineData: { name: string; indexingRatio: number; status?: string },
        gears: { id?: string; teethCount: number; quantity: number }[]
    ) => {
        await database.write(async () => {
            let targetMachine: Machine;
            if (machineId) {
                targetMachine = await database.get<Machine>('machines').find(machineId);
                await targetMachine.update((m) => {
                    m.name = machineData.name;
                    m.indexingRatio = machineData.indexingRatio;
                    m.status = machineData.status || 'active';
                });
                const existingGears = await database
                    .get<MachineChangeGear>('machine_change_gears')
                    .query(Q.where('machine_id', machineId))
                    .fetch();
                for (const g of existingGears) {
                    await g.destroyPermanently();
                }
            } else {
                targetMachine = await database.get<Machine>('machines').create((m) => {
                    m.name = machineData.name;
                    m.indexingRatio = machineData.indexingRatio;
                    m.status = machineData.status || 'active';
                    m.isActive = true;
                });
            }

            for (const gear of gears) {
                await database.get<MachineChangeGear>('machine_change_gears').create((g) => {
                    g.machineId = targetMachine.id;
                    g.teethCount = gear.teethCount;
                    g.quantity = gear.quantity;
                    g.status = 'idle';
                    g.isUniversal = false;
                });
            }
        });
    };

    const deleteCutter = async (cutter: Cutter) => {
        await database.write(async () => {
            await cutter.destroyPermanently();
        });
    };

    const deleteMachine = async (machine: Machine) => {
        await database.write(async () => {
            await machine.destroyPermanently();
        });
    };

    return {
        filter,
        setFilter,
        isAddSheetOpen,
        setIsAddSheetOpen,
        addCutter,
        updateCutter,
        addMachine,
        updateMachine,
        saveMachineWithGears,
        deleteCutter,
        deleteMachine,
    };
}
