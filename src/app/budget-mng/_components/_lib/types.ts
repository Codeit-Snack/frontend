export interface GetMonthlyBudgetDefaultResponse {
  /** `organizations.default_monthly_budget` — 없거나 미적용이면 0 */
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
