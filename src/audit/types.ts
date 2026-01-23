export interface AppAuditLogEntry {
	created: string;
	tenantId: string | null;
	cubeId: string | null;
	boxNumber: string | null;
	occupancyId: string | null;
	source: string | null;
	level: string;
	message: string;
	referenceType: string | null;
	referenceId: string | null;
	type: string;
	userId: string | null;
	data?: any;
	patch?: JsonPatch;
	actor: string | null;
}

export type JsonPatch = Array<JsonPatchItem>;

export type JsonPatchItem = AddPatch | RemovePatch | ReplacePatch | MovePatch | CopyPatch;

export interface Patch {
	path: string;
}
export interface AddPatch extends Patch {
	op: "add";
	value: any;
}
export interface RemovePatch extends Patch {
	op: "remove";
}
export interface ReplacePatch extends Patch {
	op: "replace";
	value: any;
	fromValue: any;
}
export interface MovePatch extends Patch {
	op: "move";
	from: string;
}
export interface CopyPatch extends Patch {
	op: "copy";
	from: string;
}
