/**
 * @jest-environment jsdom
 */

import {storage} from "./storage";

describe("StorageWrapper", () => {
	beforeEach(() => {
		localStorage.clear();
		sessionStorage.clear();
	});

	describe("read/write with storage type", () => {
		test("writes to localStorage by default", () => {
			storage.write("test-key", "value");
			expect(localStorage.getItem("test-key")).toBe("value");
			expect(sessionStorage.getItem("test-key")).toBeNull();
		});

		test("writes to localStorage when explicitly specified", () => {
			storage.write("test-key", "value", "local");
			expect(localStorage.getItem("test-key")).toBe("value");
			expect(sessionStorage.getItem("test-key")).toBeNull();
		});

		test("writes to sessionStorage when specified", () => {
			storage.write("test-key", "value", "session");
			expect(sessionStorage.getItem("test-key")).toBe("value");
			expect(localStorage.getItem("test-key")).toBeNull();
		});

		test("reads from correct storage area by default (local)", () => {
			localStorage.setItem("key1", "local-value");
			sessionStorage.setItem("key1", "session-value");

			expect(storage.read("key1")).toBe("local-value");
		});

		test("reads from localStorage when explicitly specified", () => {
			localStorage.setItem("key1", "local-value");
			sessionStorage.setItem("key1", "session-value");

			expect(storage.read("key1", "local")).toBe("local-value");
		});

		test("reads from sessionStorage when specified", () => {
			localStorage.setItem("key1", "local-value");
			sessionStorage.setItem("key1", "session-value");

			expect(storage.read("key1", "session")).toBe("session-value");
		});

		test("returns null for non-existent keys", () => {
			expect(storage.read("non-existent")).toBeNull();
			expect(storage.read("non-existent", "local")).toBeNull();
			expect(storage.read("non-existent", "session")).toBeNull();
		});
	});

	describe("delete with storage type", () => {
		test("deletes from localStorage by default", () => {
			localStorage.setItem("key", "local");
			sessionStorage.setItem("key", "session");

			storage.delete("key");
			expect(localStorage.getItem("key")).toBeNull();
			expect(sessionStorage.getItem("key")).toBe("session");
		});

		test("deletes from localStorage when explicitly specified", () => {
			localStorage.setItem("key", "local");
			sessionStorage.setItem("key", "session");

			storage.delete("key", "local");
			expect(localStorage.getItem("key")).toBeNull();
			expect(sessionStorage.getItem("key")).toBe("session");
		});

		test("deletes from sessionStorage when specified", () => {
			localStorage.setItem("key", "local");
			sessionStorage.setItem("key", "session");

			storage.delete("key", "session");
			expect(localStorage.getItem("key")).toBe("local");
			expect(sessionStorage.getItem("key")).toBeNull();
		});
	});

	describe("storage isolation", () => {
		test("local and session storage are isolated", () => {
			storage.write("shared-key", "local-value", "local");
			storage.write("shared-key", "session-value", "session");

			expect(storage.read("shared-key", "local")).toBe("local-value");
			expect(storage.read("shared-key", "session")).toBe("session-value");
		});

		test("deleting from one storage does not affect the other", () => {
			storage.write("shared-key", "local-value", "local");
			storage.write("shared-key", "session-value", "session");

			storage.delete("shared-key", "local");

			expect(storage.read("shared-key", "local")).toBeNull();
			expect(storage.read("shared-key", "session")).toBe("session-value");
		});
	});

	describe("write with undefined value removes key", () => {
		test("removes key when writing undefined to localStorage", () => {
			storage.write("key", "value", "local");
			expect(storage.read("key", "local")).toBe("value");

			storage.write("key", undefined, "local");
			expect(storage.read("key", "local")).toBeNull();
		});

		test("removes key when writing undefined to sessionStorage", () => {
			storage.write("key", "value", "session");
			expect(storage.read("key", "session")).toBe("value");

			storage.write("key", undefined, "session");
			expect(storage.read("key", "session")).toBeNull();
		});
	});

	describe("change listeners", () => {
		test("notifies listeners on write", () => {
			const listener = jest.fn();
			storage.addChangeListener("key", listener);

			storage.write("key", "value");
			expect(listener).toHaveBeenCalledWith(null, "value");

			storage.removeChangeListener("key", listener);
		});

		test("notifies listeners on delete", () => {
			storage.write("key", "value");

			const listener = jest.fn();
			storage.addChangeListener("key", listener);

			storage.delete("key");
			expect(listener).toHaveBeenCalledWith("value", undefined);

			storage.removeChangeListener("key", listener);
		});

		test("notifies listeners on update", () => {
			storage.write("key", "old-value");

			const listener = jest.fn();
			storage.addChangeListener("key", listener);

			storage.write("key", "new-value");
			expect(listener).toHaveBeenCalledWith("old-value", "new-value");

			storage.removeChangeListener("key", listener);
		});

		test("does not notify after listener removal", () => {
			const listener = jest.fn();
			storage.addChangeListener("key", listener);
			storage.removeChangeListener("key", listener);

			storage.write("key", "value");
			expect(listener).not.toHaveBeenCalled();
		});

		test("notifies listeners for different storage types", () => {
			const listener = jest.fn();
			storage.addChangeListener("key", listener);

			storage.write("key", "local-value", "local");
			expect(listener).toHaveBeenCalledWith(null, "local-value");

			storage.write("key", "session-value", "session");
			expect(listener).toHaveBeenCalledWith(null, "session-value");

			storage.removeChangeListener("key", listener);
		});
	});
});
