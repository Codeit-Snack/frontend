export interface GetMonthlyBudgetDefaultResponse {
  /** `default_monthly_budget` — if not set or not applied, then 0 */
  defaultMonthlyBudget: number
}

export interface PatchMonthlyBudgetDefaultBody {
  defaultMonthlyBudget: number
}

export interface PostBudgetPeriodBody {
  year: number
  month: number
  budgetAmount: number
}
