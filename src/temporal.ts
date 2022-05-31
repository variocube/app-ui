/**
 * This module is a compatibility layer for the coming release of the Temporal API
 * in browsers. It exports all relevant objects from the API to allow a smooth
 * switch to a conditional polyfill or using the browser built-ins.
 */

import {Temporal, Intl, toTemporalInstant} from '@js-temporal/polyfill';

export const {
    Instant,
    ZonedDateTime,
    PlainDateTime,
    PlainDate,
    PlainTime,
    Now,
    Duration,
} = Temporal;

export type PlainDate = Temporal.PlainDate;

export const {
    DateTimeFormat
} = Intl;

export type DateTimeFormat = Intl.DateTimeFormat;
export type DateTimeFormatOptions = Intl.DateTimeFormatOptions;

export {toTemporalInstant};