import { t as _plugin_vue_export_helper_default } from "./_plugin-vue_export-helper-BOaGB7Aw.js";
import { n as confirmDialog } from "./useNotifications-B-dR0Bzd.js";
import { n as usePermissions, t as AdminLayout_default } from "./AdminLayout-D3f-cwqR.js";
import { t as _sfc_main$1 } from "./PageHeader-D0aRDn5C.js";
import { t as DataTable_default } from "./DataTable-DOPUK-rs.js";
import { t as Modal_default } from "./Modal-CpmFAnsY.js";
import { t as StatCard_default } from "./StatCard-C81bFHCl.js";
import { Fragment, computed, createBlock, createCommentVNode, createVNode, mergeProps, openBlock, ref, renderList, toDisplayString, unref, useSSRContext, vModelSelect, vModelText, watch, withCtx, withDirectives } from "vue";
import { router } from "@inertiajs/vue3";
import { ssrIncludeBooleanAttr, ssrInterpolate, ssrLooseContain, ssrLooseEqual, ssrRenderAttr, ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrRenderList } from "vue/server-renderer";
//#region resources/js/pages/HR/Attendance.vue
var _sfc_main = /*@__PURE__*/ Object.assign({ layout: AdminLayout_default }, {
	__name: "Attendance",
	__ssrInlineRender: true,
	props: {
		date: {
			type: String,
			default: ""
		},
		roster: {
			type: Array,
			default: () => []
		},
		statuses: {
			type: Array,
			default: () => []
		},
		filters: {
			type: Object,
			default: () => ({ search: "" })
		},
		monthSummary: {
			type: Object,
			default: () => ({
				month: "",
				present: 0,
				absent: 0,
				leave: 0,
				marked_days: 0
			})
		},
		monthlyReport: {
			type: Object,
			default: () => ({
				month_label: "",
				rows: []
			})
		},
		branches: {
			type: Array,
			default: () => []
		}
	},
	setup(__props) {
		const { can } = usePermissions();
		const props = __props;
		const editable = computed(() => can("hr.attendance.create"));
		const showReport = ref(false);
		const reportEmployee = ref("");
		const columns = [
			{
				key: "name",
				label: "Employee"
			},
			{
				key: "designation_name",
				label: "Designation"
			},
			{
				key: "status",
				label: "Status",
				width: "140px"
			},
			{
				key: "check_in",
				label: "In",
				width: "120px"
			},
			{
				key: "check_out",
				label: "Out",
				width: "120px"
			},
			{
				key: "late_minutes",
				label: "Late (min)",
				width: "110px"
			},
			{
				key: "note",
				label: "Note"
			}
		];
		const reportColumns = [
			{
				key: "date",
				label: "Date"
			},
			{
				key: "day",
				label: "Day"
			},
			{
				key: "employee",
				label: "Employee"
			},
			{
				key: "designation",
				label: "Designation"
			},
			{
				key: "status",
				label: "Status"
			}
		];
		const clone = (rows) => rows.map((r) => ({ ...r }));
		const sheet = ref(clone(props.roster));
		const baseline = ref(JSON.stringify(sheet.value));
		const saving = ref(false);
		const date = computed(() => props.date);
		const formatCoordinate = (value) => value === null || value === "" ? value : Number(value).toFixed(17);
		const branchForms = ref(props.branches.map((branch) => ({
			...branch,
			latitude: formatCoordinate(branch.latitude),
			longitude: formatCoordinate(branch.longitude),
			saving: false
		})));
		watch(() => props.roster, (rows) => {
			sheet.value = clone(rows);
			baseline.value = JSON.stringify(sheet.value);
		});
		const dirty = computed(() => JSON.stringify(sheet.value) !== baseline.value);
		const tallies = computed(() => sheet.value.reduce((acc, row) => {
			acc[row.status] = (acc[row.status] || 0) + 1;
			return acc;
		}, {}));
		const changeReportMonth = (value) => {
			if (!value) return;
			router.get("/hr/attendance", { date: `${value}-01` }, {
				preserveState: false,
				preserveScroll: true
			});
		};
		const filteredReportRows = computed(() => reportEmployee.value ? props.monthlyReport.rows.filter((row) => String(row.employee_id) === reportEmployee.value) : props.monthlyReport.rows);
		const saveSheet = () => {
			saving.value = true;
			router.post("/hr/attendance/bulk", {
				date: props.date,
				rows: sheet.value.map((row) => ({
					user_id: row.user_id,
					status: row.status,
					check_in: row.check_in || null,
					check_out: row.check_out || null,
					late_minutes: row.late_minutes || 0,
					note: row.note || null
				}))
			}, {
				preserveScroll: true,
				onFinish: () => saving.value = false
			});
		};
		const clearRow = async (row) => {
			if (!await confirmDialog(`Remove the saved attendance entry for ${row.name}?`)) return;
			router.delete(`/hr/attendance/${row.attendance_id}`, { preserveScroll: true });
		};
		const label = (s) => s ? s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "—";
		const badgeClass = (s) => ({
			present: "ui-badge--success",
			late: "ui-badge--warning",
			half_day: "ui-badge--warning",
			absent: "ui-badge--muted",
			leave: "ui-badge--info",
			holiday: "ui-badge--info"
		})[s] ?? "ui-badge--muted";
		return (_ctx, _push, _parent, _attrs) => {
			_push(`<div${ssrRenderAttrs(mergeProps({ class: "page" }, _attrs))} data-v-a2d129a0>`);
			_push(ssrRenderComponent(_sfc_main$1, {
				title: "Attendance",
				subtitle: "Mark the whole roster for a day, then save the sheet in one go."
			}, null, _parent));
			_push(`<div class="att__bar ui-card ui-card-pad" data-v-a2d129a0><div class="att__date" data-v-a2d129a0><label class="ui-label" for="att-date" data-v-a2d129a0>Date</label><input id="att-date" class="ui-input" type="date"${ssrRenderAttr("value", date.value)} data-v-a2d129a0></div>`);
			if (unref(can)("hr.attendance.create")) _push(`<div class="att__bulk" data-v-a2d129a0><span class="ui-label" data-v-a2d129a0>Mark everyone</span><div class="att__bulk-btns" data-v-a2d129a0><button class="ui-btn ui-btn--ghost ui-btn--sm" data-v-a2d129a0>Present</button><button class="ui-btn ui-btn--ghost ui-btn--sm" data-v-a2d129a0>Absent</button><button class="ui-btn ui-btn--ghost ui-btn--sm" data-v-a2d129a0>Holiday</button></div></div>`);
			else _push(`<!---->`);
			_push(`<div class="att__tallies" data-v-a2d129a0><!--[-->`);
			ssrRenderList(props.statuses, (s) => {
				_push(`<span class="${ssrRenderClass([badgeClass(s), "ui-badge"])}" data-v-a2d129a0>${ssrInterpolate(label(s))}: ${ssrInterpolate(tallies.value[s] || 0)}</span>`);
			});
			_push(`<!--]--><span class="ui-badge ui-badge--info" data-v-a2d129a0>Total: ${ssrInterpolate(sheet.value.length)}</span></div></div>`);
			if (unref(can)("hr.attendance.update")) {
				_push(`<div class="att__settings ui-card ui-card-pad" data-v-a2d129a0><div data-v-a2d129a0><strong data-v-a2d129a0>Branch attendance locations</strong><p class="att__hint" data-v-a2d129a0>Each employee is checked against the branch assigned to their place.</p></div><!--[-->`);
				ssrRenderList(branchForms.value, (branch) => {
					_push(`<div class="att__settings-row" data-v-a2d129a0><strong data-v-a2d129a0>${ssrInterpolate(branch.name)}</strong><input${ssrRenderAttr("value", branch.latitude)} class="ui-input" type="number" step="0.0000001" min="-90" max="90" placeholder="Latitude" data-v-a2d129a0><input${ssrRenderAttr("value", branch.longitude)} class="ui-input" type="number" step="0.0000001" min="-180" max="180" placeholder="Longitude" data-v-a2d129a0><input${ssrRenderAttr("value", branch.attendance_radius_meters)} class="ui-input att__num" type="number" min="10" max="5000" title="Allowed radius in meters" data-v-a2d129a0><input${ssrRenderAttr("value", branch.attendance_start_time)} class="ui-input" type="time" title="Shift start time" data-v-a2d129a0><button class="ui-btn ui-btn--ghost ui-btn--sm"${ssrIncludeBooleanAttr(branch.saving) ? " disabled" : ""} data-v-a2d129a0>${ssrInterpolate(branch.saving ? "Saving…" : "Save")}</button></div>`);
				});
				_push(`<!--]-->`);
				if (!branchForms.value.length) _push(`<p class="att__hint" data-v-a2d129a0>No branches have been configured.</p>`);
				else _push(`<!---->`);
				_push(`</div>`);
			} else _push(`<!---->`);
			_push(`<div class="stat-grid" data-v-a2d129a0>`);
			_push(ssrRenderComponent(StatCard_default, {
				label: `Present (${props.monthSummary.month})`,
				value: props.monthSummary.present
			}, null, _parent));
			_push(ssrRenderComponent(StatCard_default, {
				label: `Absent (${props.monthSummary.month})`,
				value: props.monthSummary.absent
			}, null, _parent));
			_push(ssrRenderComponent(StatCard_default, {
				label: `On leave (${props.monthSummary.month})`,
				value: props.monthSummary.leave
			}, null, _parent));
			_push(ssrRenderComponent(StatCard_default, {
				label: "Days marked this month",
				value: props.monthSummary.marked_days
			}, null, _parent));
			_push(`</div><div class="att__report ui-card ui-card-pad" data-v-a2d129a0><div class="att__report-head" data-v-a2d129a0><div data-v-a2d129a0><h3 class="att__report-title" data-v-a2d129a0>Monthly Attendance Report</h3><p class="att__hint" data-v-a2d129a0>${ssrInterpolate(props.monthlyReport.month_label)} — date-wise totals for payroll review.</p></div><button class="ui-btn ui-btn--primary ui-btn--sm" data-v-a2d129a0>View Full Report</button></div></div>`);
			if (dirty.value) _push(`<div class="ui-alert ui-alert--danger att__unsaved-alert" data-v-a2d129a0> You have unsaved changes on this sheet — click <strong data-v-a2d129a0>Save Sheet</strong> before switching dates. </div>`);
			else _push(`<!---->`);
			_push(ssrRenderComponent(Modal_default, {
				modelValue: showReport.value,
				"onUpdate:modelValue": ($event) => showReport.value = $event,
				title: "Monthly Attendance Report",
				width: "900px"
			}, {
				footer: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) _push(`<button class="ui-btn ui-btn--ghost" data-v-a2d129a0${_scopeId}>Close</button>`);
					else return [createVNode("button", {
						class: "ui-btn ui-btn--ghost",
						onClick: ($event) => showReport.value = false
					}, "Close", 8, ["onClick"])];
				}),
				default: withCtx((_, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="att__report-month" data-v-a2d129a0${_scopeId}><label class="ui-label" for="report-month" data-v-a2d129a0${_scopeId}>Month</label><input id="report-month" class="ui-input" type="month"${ssrRenderAttr("value", props.monthlyReport.month)} data-v-a2d129a0${_scopeId}><label class="ui-label" for="report-employee" data-v-a2d129a0${_scopeId}>Employee</label><select id="report-employee" class="ui-select" data-v-a2d129a0${_scopeId}><option value="" data-v-a2d129a0${ssrIncludeBooleanAttr(Array.isArray(reportEmployee.value) ? ssrLooseContain(reportEmployee.value, "") : ssrLooseEqual(reportEmployee.value, "")) ? " selected" : ""}${_scopeId}>All employees</option><!--[-->`);
						ssrRenderList(props.monthlyReport.employees, (employee) => {
							_push(`<option${ssrRenderAttr("value", String(employee.id))} data-v-a2d129a0${ssrIncludeBooleanAttr(Array.isArray(reportEmployee.value) ? ssrLooseContain(reportEmployee.value, String(employee.id)) : ssrLooseEqual(reportEmployee.value, String(employee.id))) ? " selected" : ""}${_scopeId}>${ssrInterpolate(employee.name)}</option>`);
						});
						_push(`<!--]--></select></div>`);
						_push(ssrRenderComponent(DataTable_default, {
							columns: reportColumns,
							rows: filteredReportRows.value,
							searchable: "",
							"search-placeholder": "Filter report…",
							"empty-text": "No attendance report data."
						}, {
							"cell:status": withCtx(({ value }, _push, _parent, _scopeId) => {
								if (_push) _push(`<span class="${ssrRenderClass([badgeClass(value), "ui-badge"])}" data-v-a2d129a0${_scopeId}>${ssrInterpolate(label(value))}</span>`);
								else return [createVNode("span", { class: ["ui-badge", badgeClass(value)] }, toDisplayString(label(value)), 3)];
							}),
							_: 1
						}, _parent, _scopeId));
					} else return [createVNode("div", { class: "att__report-month" }, [
						createVNode("label", {
							class: "ui-label",
							for: "report-month"
						}, "Month"),
						createVNode("input", {
							id: "report-month",
							class: "ui-input",
							type: "month",
							value: props.monthlyReport.month,
							onChange: ($event) => changeReportMonth($event.target.value)
						}, null, 40, ["value", "onChange"]),
						createVNode("label", {
							class: "ui-label",
							for: "report-employee"
						}, "Employee"),
						withDirectives(createVNode("select", {
							id: "report-employee",
							"onUpdate:modelValue": ($event) => reportEmployee.value = $event,
							class: "ui-select"
						}, [createVNode("option", { value: "" }, "All employees"), (openBlock(true), createBlock(Fragment, null, renderList(props.monthlyReport.employees, (employee) => {
							return openBlock(), createBlock("option", {
								key: employee.id,
								value: String(employee.id)
							}, toDisplayString(employee.name), 9, ["value"]);
						}), 128))], 8, ["onUpdate:modelValue"]), [[vModelSelect, reportEmployee.value]])
					]), createVNode(DataTable_default, {
						columns: reportColumns,
						rows: filteredReportRows.value,
						searchable: "",
						"search-placeholder": "Filter report…",
						"empty-text": "No attendance report data."
					}, {
						"cell:status": withCtx(({ value }) => [createVNode("span", { class: ["ui-badge", badgeClass(value)] }, toDisplayString(label(value)), 3)]),
						_: 1
					}, 8, ["rows"])];
				}),
				_: 1
			}, _parent));
			_push(ssrRenderComponent(DataTable_default, {
				columns,
				rows: sheet.value,
				index: "",
				searchable: "",
				"search-placeholder": "Filter by name, code or designation…",
				"empty-text": "No active employees. Add employees under HR → Employees."
			}, {
				"cell:name": withCtx(({ row }, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="att__name" data-v-a2d129a0${_scopeId}><strong data-v-a2d129a0${_scopeId}>${ssrInterpolate(row.name)}</strong>`);
						if (row.employee_code) _push(`<span class="att__code" data-v-a2d129a0${_scopeId}>${ssrInterpolate(row.employee_code)}</span>`);
						else _push(`<!---->`);
						_push(`</div>`);
					} else return [createVNode("div", { class: "att__name" }, [createVNode("strong", null, toDisplayString(row.name), 1), row.employee_code ? (openBlock(), createBlock("span", {
						key: 0,
						class: "att__code"
					}, toDisplayString(row.employee_code), 1)) : createCommentVNode("", true)])];
				}),
				"cell:status": withCtx(({ row }, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<select class="ui-select att__select"${ssrIncludeBooleanAttr(!editable.value) ? " disabled" : ""} data-v-a2d129a0${_scopeId}><!--[-->`);
						ssrRenderList(props.statuses, (s) => {
							_push(`<option${ssrRenderAttr("value", s)} data-v-a2d129a0${ssrIncludeBooleanAttr(Array.isArray(row.status) ? ssrLooseContain(row.status, s) : ssrLooseEqual(row.status, s)) ? " selected" : ""}${_scopeId}>${ssrInterpolate(label(s))}</option>`);
						});
						_push(`<!--]--></select>`);
					} else return [withDirectives(createVNode("select", {
						"onUpdate:modelValue": ($event) => row.status = $event,
						class: "ui-select att__select",
						disabled: !editable.value
					}, [(openBlock(true), createBlock(Fragment, null, renderList(props.statuses, (s) => {
						return openBlock(), createBlock("option", {
							key: s,
							value: s
						}, toDisplayString(label(s)), 9, ["value"]);
					}), 128))], 8, ["onUpdate:modelValue", "disabled"]), [[vModelSelect, row.status]])];
				}),
				"cell:check_in": withCtx(({ row }, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="att__event" data-v-a2d129a0${_scopeId}><input${ssrRenderAttr("value", row.check_in)} class="ui-input att__time" type="time"${ssrIncludeBooleanAttr(!editable.value) ? " disabled" : ""} data-v-a2d129a0${_scopeId}>`);
						if (row.check_in_distance_meters !== null) _push(`<small class="att__verified" data-v-a2d129a0${_scopeId}>GPS ${ssrInterpolate(row.check_in_distance_meters)}m</small>`);
						else _push(`<!---->`);
						_push(`</div>`);
					} else return [createVNode("div", { class: "att__event" }, [withDirectives(createVNode("input", {
						"onUpdate:modelValue": ($event) => row.check_in = $event,
						class: "ui-input att__time",
						type: "time",
						disabled: !editable.value
					}, null, 8, ["onUpdate:modelValue", "disabled"]), [[vModelText, row.check_in]]), row.check_in_distance_meters !== null ? (openBlock(), createBlock("small", {
						key: 0,
						class: "att__verified"
					}, "GPS " + toDisplayString(row.check_in_distance_meters) + "m", 1)) : createCommentVNode("", true)])];
				}),
				"cell:check_out": withCtx(({ row }, _push, _parent, _scopeId) => {
					if (_push) {
						_push(`<div class="att__event" data-v-a2d129a0${_scopeId}><input${ssrRenderAttr("value", row.check_out)} class="ui-input att__time" type="time"${ssrIncludeBooleanAttr(!editable.value) ? " disabled" : ""} data-v-a2d129a0${_scopeId}>`);
						if (row.check_out_distance_meters !== null) _push(`<small class="att__verified" data-v-a2d129a0${_scopeId}>GPS ${ssrInterpolate(row.check_out_distance_meters)}m</small>`);
						else _push(`<!---->`);
						_push(`</div>`);
					} else return [createVNode("div", { class: "att__event" }, [withDirectives(createVNode("input", {
						"onUpdate:modelValue": ($event) => row.check_out = $event,
						class: "ui-input att__time",
						type: "time",
						disabled: !editable.value
					}, null, 8, ["onUpdate:modelValue", "disabled"]), [[vModelText, row.check_out]]), row.check_out_distance_meters !== null ? (openBlock(), createBlock("small", {
						key: 0,
						class: "att__verified"
					}, "GPS " + toDisplayString(row.check_out_distance_meters) + "m", 1)) : createCommentVNode("", true)])];
				}),
				"cell:late_minutes": withCtx(({ row }, _push, _parent, _scopeId) => {
					if (_push) _push(`<input${ssrRenderAttr("value", row.late_minutes)} class="ui-input att__num" type="number" min="0" max="1440"${ssrIncludeBooleanAttr(!editable.value) ? " disabled" : ""} data-v-a2d129a0${_scopeId}>`);
					else return [withDirectives(createVNode("input", {
						"onUpdate:modelValue": ($event) => row.late_minutes = $event,
						class: "ui-input att__num",
						type: "number",
						min: "0",
						max: "1440",
						disabled: !editable.value
					}, null, 8, ["onUpdate:modelValue", "disabled"]), [[
						vModelText,
						row.late_minutes,
						void 0,
						{ number: true }
					]])];
				}),
				"cell:note": withCtx(({ row }, _push, _parent, _scopeId) => {
					if (_push) _push(`<input${ssrRenderAttr("value", row.note)} class="ui-input" type="text" placeholder="Note"${ssrIncludeBooleanAttr(!editable.value) ? " disabled" : ""} data-v-a2d129a0${_scopeId}>`);
					else return [withDirectives(createVNode("input", {
						"onUpdate:modelValue": ($event) => row.note = $event,
						class: "ui-input",
						type: "text",
						placeholder: "Note",
						disabled: !editable.value
					}, null, 8, ["onUpdate:modelValue", "disabled"]), [[vModelText, row.note]])];
				}),
				actions: withCtx(({ row }, _push, _parent, _scopeId) => {
					if (_push) {
						if (unref(can)("hr.attendance.create")) _push(`<button class="ui-btn ui-btn--primary ui-btn--sm"${ssrIncludeBooleanAttr(saving.value || !sheet.value.length) ? " disabled" : ""} data-v-a2d129a0${_scopeId}>${ssrInterpolate(saving.value ? "Saving…" : "Save Sheet")}</button>`);
						else _push(`<!---->`);
						if (row.attendance_id && unref(can)("hr.attendance.delete")) _push(`<button class="ui-btn ui-btn--danger ui-btn--sm" data-v-a2d129a0${_scopeId}> Clear </button>`);
						else _push(`<span class="att__unsaved" data-v-a2d129a0${_scopeId}>${ssrInterpolate(row.attendance_id ? "" : "Not saved")}</span>`);
					} else return [unref(can)("hr.attendance.create") ? (openBlock(), createBlock("button", {
						key: 0,
						class: "ui-btn ui-btn--primary ui-btn--sm",
						disabled: saving.value || !sheet.value.length,
						onClick: saveSheet
					}, toDisplayString(saving.value ? "Saving…" : "Save Sheet"), 9, ["disabled"])) : createCommentVNode("", true), row.attendance_id && unref(can)("hr.attendance.delete") ? (openBlock(), createBlock("button", {
						key: 1,
						class: "ui-btn ui-btn--danger ui-btn--sm",
						onClick: ($event) => clearRow(row)
					}, " Clear ", 8, ["onClick"])) : (openBlock(), createBlock("span", {
						key: 2,
						class: "att__unsaved"
					}, toDisplayString(row.attendance_id ? "" : "Not saved"), 1))];
				}),
				_: 1
			}, _parent));
			_push(`</div>`);
		};
	}
});
var _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
	const ssrContext = useSSRContext();
	(ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("resources/js/pages/HR/Attendance.vue");
	return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var Attendance_default = /*#__PURE__*/ _plugin_vue_export_helper_default(_sfc_main, [["__scopeId", "data-v-a2d129a0"]]);
//#endregion
export { Attendance_default as default };
