import { useState } from 'react';
import { database } from '@/db';
import { Cutter, Machine } from '@/db/models';
import { withObservables } from '@nozbe/watermelondb/react';
import { Q } from '@nozbe/watermelondb';

export type InventoryFilter = 'all' | 'machine' | 'cutter';

export function useInventory() {
    const [filter, setFilter] = useState<InventoryFilter>('all');
    const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);

    const addCutter = async (data: {
        cutterType: string;
        moduleOrDp: number;
        pressureAngle: number;
        angle: number;
        bore: number;
        diameter?: number;
        material?: string;
    }) => {
        await database.write(async () => {
            await database.get<Cutter>('cutters').create((cutter) => {
                cutter.cutterType = data.cutterType;
                cutter.moduleOrDp = data.moduleOrDp;
                cutter.pressureAngle = data.pressureAngle;
                cutter.angle = data.angle;
                cutter.bore = data.bore;
                cutter.diameter = data.diameter;
                cutter.material = data.material;
                cutter.currentStatus = 'sharp'; // default status
                cutter.usageCount = 0;
            });
        });
    };

    const updateCutter = async (id: string, data: {
        cutterType: string;
        moduleOrDp: number;
        pressureAngle: number;
        angle: number;
        bore: number;
        diameter?: number;
        material?: string;
    }) => {
        await database.write(async () => {
            const cutter = await database.get<Cutter>('cutters').find(id);
            await cutter.update((c) => {
                c.cutterType = data.cutterType;
                c.moduleOrDp = data.moduleOrDp;
                c.pressureAngle = data.pressureAngle;
                c.angle = data.angle;
                c.bore = data.bore;
                c.diameter = data.diameter;
                c.material = data.material;
            });
        });
    };
    const addMachine = async (data: {
        name: string;
        indexingRatio: number;
        feedConstant: number;
    }) => {
        await database.write(async () => {
            await database.get<Machine>('machines').create((machine) => {
                machine.name = data.name;
                machine.indexingRatio = data.indexingRatio;
                machine.feedConstant = data.feedConstant;
                machine.isActive = true;
            });
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
        deleteCutter,
        deleteMachine,
    };
}
