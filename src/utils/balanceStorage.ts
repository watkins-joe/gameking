import {
  DENOMINATIONS,
  type Denomination,
} from "../config/gameConfig";

export const BALANCE_STORAGE_KEY = "gameking.balanceCents";
export const DENOMINATION_STORAGE_KEY = "gameking.denomination";

type BalanceStorage = Pick<Storage, "getItem" | "setItem">;

export function loadBalanceCents(
  storage: BalanceStorage,
  startingBalanceCents: number,
): number {
  const storedBalance = storage.getItem(BALANCE_STORAGE_KEY);
  if (storedBalance === null) return startingBalanceCents;

  const balanceCents = Number(storedBalance);
  if (
    storedBalance.trim() === "" ||
    !Number.isSafeInteger(balanceCents) ||
    balanceCents < 0
  ) {
    console.error("Stored bank balance is invalid; using the starting balance.");
    return startingBalanceCents;
  }

  return balanceCents;
}

export function saveBalanceCents(
  storage: BalanceStorage,
  balanceCents: number,
): void {
  storage.setItem(BALANCE_STORAGE_KEY, String(balanceCents));
}

export function loadDenomination(
  storage: BalanceStorage,
  defaultDenomination: Denomination,
): Denomination {
  const storedDenomination = storage.getItem(DENOMINATION_STORAGE_KEY);
  if (storedDenomination === null) return defaultDenomination;

  const denomination = Object.keys(DENOMINATIONS).find(
    (value) => value === storedDenomination,
  );
  if (denomination !== undefined) return denomination as Denomination;

  console.error("Stored denomination is invalid; using the default.");
  return defaultDenomination;
}

export function saveDenomination(
  storage: BalanceStorage,
  denomination: Denomination,
): void {
  storage.setItem(DENOMINATION_STORAGE_KEY, denomination);
}
