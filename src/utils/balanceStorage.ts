export const BALANCE_STORAGE_KEY = "gameking.balanceCents";

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
