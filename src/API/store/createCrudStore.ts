import { create } from "zustand";
import { showErrorToast, showSuccessToast } from "../../components/toast";

interface CrudStoreOptions<TData, TCreate, TUpdate> {
    name: string;
    service: {
        fetchAll: () => Promise<TData[]>;
        fetchById: (id: number) => Promise<TData>;
        create: (payload: TCreate) => Promise<TData>;
        update: (id: number, payload: TUpdate) => Promise<TData>;
        delete: (id: number) => Promise<boolean>;
    };
}

export const createCrudStore = <TData, TCreate, TUpdate>({
    name,
    service,
}: CrudStoreOptions<TData, TCreate, TUpdate>) =>
    create<{
        list: TData[];
        detail: TData | null;
        isLoading: boolean;
        error: string | null;

        fetchAll: () => Promise<{ success: boolean; message?: string }>;
        fetchById: (id: number) => Promise<void>;
        createData: (payload: TCreate) => Promise<{ success: boolean; message?: string }>;
        updateData: (id: number, payload: TUpdate) => Promise<{ success: boolean; message?: string }>;
        deleteData: (id: number) => Promise<void>;
    }>((set, get) => ({
        list: [],
        detail: null,
        isLoading: false,
        error: null,

        fetchAll: async () => {
            set({ isLoading: true, error: null });
            try {
                const data = await service.fetchAll();
                set({ list: data });
                return { success: true };
            } catch (err: any) {
                const msg = err.message || `Failed to fetch ${name}`;
                showErrorToast(msg);
                set({ error: msg });
                return { success: false, message: msg };
            } finally {
                set({ isLoading: false });
            }
        },

        fetchById: async (id: number) => {
            set({ isLoading: true, error: null });
            try {
                const detail = await service.fetchById(id);
                set({ detail });
            } catch (err: any) {
                const msg = err.message || `Failed to fetch ${name} by id`;
                showErrorToast(msg);
                set({ error: msg });
            } finally {
                set({ isLoading: false });
            }
        },

        createData: async (payload: TCreate) => {
            set({ isLoading: true, error: null });
            try {
                await service.create(payload);
                showSuccessToast(`${name} created successfully`);
                await get().fetchAll();
                return { success: true };
            } catch (err: any) {
                const msg = err.message || `Failed to create ${name}`;
                showErrorToast(msg);
                set({ error: msg });
                return { success: false, message: msg };
            } finally {
                set({ isLoading: false });
            }
        },

        updateData: async (id: number, payload: TUpdate) => {
            set({ isLoading: true, error: null });
            try {
                await service.update(id, payload);
                showSuccessToast(`${name} updated successfully`);
                await get().fetchAll();
                return { success: true };
            } catch (err: any) {
                const msg = err.message || `Failed to update ${name}`;
                showErrorToast(msg);
                set({ error: msg });
                return { success: false, message: msg };
            } finally {
                set({ isLoading: false });
            }
        },

        deleteData: async (id: number) => {
            set({ isLoading: true, error: null });
            try {
                await service.delete(id);
                showSuccessToast(`${name} deleted successfully`);
                await get().fetchAll();
            } catch (err: any) {
                const msg = err.message || `Failed to delete ${name}`;
                showErrorToast(msg);
                set({ error: msg });
            } finally {
                set({ isLoading: false });
            }
        },
    }));
