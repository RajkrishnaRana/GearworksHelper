import Cutter from './Cutter';
import CutterMaintenanceLog from './CutterMaintenanceLog';
import Customer from './Customer';
import GearSpecification from './GearSpecification';
import Machine from './Machine';
import MachineChangeGear from './MachineChangeGear';
import Order from './Order';
import ProductionSetup from './ProductionSetup';
import RatioLookupCache from './RatioLookupCache';

export {
  Cutter,
  CutterMaintenanceLog,
  Customer,
  GearSpecification,
  Machine,
  MachineChangeGear,
  Order,
  ProductionSetup,
  RatioLookupCache,
};

export const modelClasses = [
  Machine,
  MachineChangeGear,
  Cutter,
  CutterMaintenanceLog,
  RatioLookupCache,
  Customer,
  Order,
  GearSpecification,
  ProductionSetup,
];
