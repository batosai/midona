import { Job } from '@nemoventures/adonis-jobs'
import type { BullJobsOptions } from '@nemoventures/adonis-jobs/types'

export type TestData = {}

export type TestReturn = {}

export default class Test extends Job<TestData, TestReturn> {
  static options: BullJobsOptions = {}

  async process(): Promise<TestReturn> {
    throw new Error('Job processor not implemented.')
  }
}
