import Cutter from './Cutter';
import CutterMaintenanceLog from './CutterMaintenanceLog';
import Customer from './Customer';
import GearSpecification from './GearSpecification';
import Machine from './Machine';
import MachineChangeGear from './MachineChangeGear';
import Order from './Order';
import ProductionSetup from './ProductionSetup';
import RatioLookupCache from './RatioLookupCache';
import Product from './Product';
import Record from './Record';
import WormWheelSpecification from './WormWheelSpecification';

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
  Product,
  Record,
  WormWheelSpecification,
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
  Product,
  Record,
  WormWheelSpecification,
];
