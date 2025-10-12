#!/usr/bin/env bash
set -eou pipefail

adb logcat "*:E" "ReactNative:W" "ReactNativeJS:E" "AndroidRuntime:E" "BluetoothPowerStatsCollector:S" "ProcfsParsingUtils:S" "ConfigUpdater:S" "sgy:S" "sgv:S" "acpu:S" "aigh:S" "AbstractGmsTracer:S" "GnssPsdsDownloader:S" "TaskPersister:S" "fkpd:E"
