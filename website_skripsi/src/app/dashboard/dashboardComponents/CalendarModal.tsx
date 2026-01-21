"use client";

import { useState } from "react";
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    addDays,
    addMonths,
    subMonths,
    isSameMonth,
    isToday,
    parseISO,
} from "date-fns";
import Image from "next/image";
import { icons } from "@/app/lib/assets/assets";
import { AgendaFreq, AgendaResponse, CreateAgenda, FormDataAgenda } from "@/app/lib/types/agendas/agendaTypes";
import { useProject } from "@/app/lib/hooks/project/useProject";
import { useAgenda } from "@/app/lib/hooks/agenda/useAgenda";
import toast from "react-hot-toast";
import CustomToast from "@/app/rootComponents/CustomToast";
import ConfirmationPopUpModal from "./allComponents/ConfirmationPopUpModal";

type Props = {
    events?: AgendaResponse[];
};

export default function CalendarModal({ events = [] }: Props) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [panelMode, setPanelMode] = useState<"create" | "detail" | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<AgendaResponse | null>(null);
    const [selectedOccurrence, setSelectedOccurrence] = useState<{id: string, date: string} | null>(null);
    const [isOccurent, setIsOccurent] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const { mutate, isPending } = useAgenda().createAgendas();
    const { updateAgendas, updateOccurrences, deleteAgenda } = useAgenda();
    const updateAgendaMutation = updateAgendas();
    const updateOccurrenceMutation = updateOccurrences();
    const deleteAgendaMutation = deleteAgenda();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState<FormDataAgenda>({
        title: "",
        date: "",
        time: "",
        projectId: null,
        frequency: null, 
    });
    const [editFormData, setEditFormData] = useState<FormDataAgenda>({
        title: "",
        date: "",
        time: "",
        projectId: null,
        frequency: null, 
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value, 
        }));
    }
    
    const { data: fetchedDataProject, isLoading, error } = useProject().fetchAllProject();
    
    if (isLoading) {
        return <div className="text-center text-(--color-muted)">Memuat data...</div>;
    }

    if (!fetchedDataProject) {
        return <div className="text-center text-red-500">Data tidak ditemukan.</div>;
    }

    const project = Array.isArray(fetchedDataProject.data) ? fetchedDataProject.data : [];
    const safeEvents = Array.isArray(events) ? events : [];
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
    
    const toDate = (isoString: string) => {
        if (!isoString) return "-";

        const date = new Date(isoString);
        return date.toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const days = [];
    let day = startDate;

    while (day <= endDate) {
        days.push(day);
        day = addDays(day, 1);
    }

    const getEventsForDate = (date: Date) => {
        const dateStr = format(date, "yyyy-MM-dd");
        const eventsOnDate: Array<{event: AgendaResponse, isOccurrence: boolean, occurrenceId?: string}> = [];
        
        safeEvents.forEach((event) => {
            if (event.frequency && event.occurrences?.length > 0) {
                event.occurrences.forEach((occurrence) => {
                    if (!occurrence.isCancelled && format(parseISO(occurrence.date), "yyyy-MM-dd") === dateStr) {
                        eventsOnDate.push({ event, isOccurrence: true, occurrenceId: occurrence.id });
                    }
                });
            } else {
                if (format(parseISO(event.eventDate), "yyyy-MM-dd") === dateStr) {
                    eventsOnDate.push({ event, isOccurrence: false });
                }
            }
        });
        
        return eventsOnDate;
    };

    const buildISODate = (source: "create" | "edit") => {
        const data = source === "edit" ? editFormData : formData;

        if (!data.date || !data.time) return "";

        return new Date(`${data.date}T${data.time}`).toISOString();
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    }

    const openDetail = (
        event: AgendaResponse,
        occurrence?: { id: string; date: string }
    ) => {
        const sourceDate = occurrence?.date ?? event.eventDate;
        const parsed = parseISO(sourceDate);

        setSelectedEvent(event);
        setSelectedOccurrence(occurrence ?? null);

        setEditFormData({
            title: event.title,
            date: format(parsed, "yyyy-MM-dd"),
            time: format(parsed, "HH:mm"),
            projectId: event.projectId ?? null,
            frequency: event.frequency ?? null,
        });

        setIsOccurent(event.frequency !== null);
        setPanelMode("detail");
    };


    const handleUpdateAgenda = () => {
        if (!selectedEvent) return;
        const eventDate = buildISODate("edit");
        console.log(eventDate);

        if (!eventDate) {
            toast.custom(
                <CustomToast type="error" message="Tanggal dan waktu wajib diisi" />
            );
            return;
        }

        const isRecurring = selectedEvent.frequency !== null;

        updateAgendaMutation.mutate(
            {
                id: selectedEvent.id,
                agendaData: {
                    title: editFormData.title,
                    eventDate,
                    projectId: editFormData.projectId,
                    frequency: isRecurring ? editFormData.frequency : null,
                },
            },
            {
                onSuccess: () => {
                    toast.custom(<CustomToast type="success" message="Agenda berhasil diperbarui" />);
                    setPanelMode(null);
                },
                onError: (err) => {
                    toast.custom(<CustomToast type="error" message={err.message} />);
                },
            }
        );
    }

    const handleUpdateOccurrence = () => {
        if (!selectedOccurrence) return;
        const eventDate = buildISODate("edit");
        
        if (!eventDate) {
            toast.custom(<CustomToast type="error" message="Tanggal & waktu wajib diisi" />);
            return;
        }

        updateOccurrenceMutation.mutate(
            {
                id: selectedOccurrence.id,
                occurrencesData: {
                    date: eventDate,
                    isCancelled: false,
                },
            },
            {
                onSuccess: () => {
                    toast.custom(<CustomToast type="success" message="Occurrence berhasil diperbarui" />);
                    setPanelMode(null);
                },
                onError: (err) => {
                    toast.custom(<CustomToast type="error" message={err.message} />);
                },
            }
        );
    };

    const handleSubmit = () => {
        const eventDate = buildISODate("create");
        console.log("eventDate", eventDate);

        if (!eventDate) {
            toast.custom(
                <CustomToast type="error" message="Tanggal dan waktu wajib diisi" />
            );
            return;
        }

        const payload: CreateAgenda = {
            title: formData.title,
            eventDate,
            projectId: formData.projectId,
            frequency: isOccurent ? formData.frequency : null,
        };
        console.log(payload);

        mutate(payload, {
            onSuccess: () => {
                toast.custom(
                    <CustomToast type="success" message="Agenda berhasil dibuat" />
                );
                setIsModalOpen(false);
                
                setFormData({
                    title: "",
                    date: "",
                    time: "",
                    projectId: null,
                    frequency: null,
                });
                setIsOccurent(false);
                
                setPanelMode(null);
            },
            onError: (error) => {
                toast.custom(
                    <CustomToast type="error" message={error.message || "Terjadi kesalahan"} />
                );
            },
        });
    };

    const handleDelete = () => {
        if (!selectedEvent) return;   

        deleteAgendaMutation.mutate(selectedEvent.id, {
            onSuccess: () => {
                toast.custom(
                    <CustomToast 
                        type="success"
                        message="Agenda berhasil dihapus"
                    />
                );
                setIsModalOpen(false);
                setSelectedEvent(null);
            },
            onError: (error) => {
                toast.custom(
                    <CustomToast 
                        type="error"
                        message={error?.message || "Terjadi kendala ketika ingin menghapus agenda"}
                    />
                )
            }
        })        
    }

    return (
        <div className="flex flex-col gap-4 w-full relative md:flex-row">
            <div className={`bg-(--color-surface) text-white rounded-xl p-4 shadow-lg ${panelMode ? "w-full md:w-3/4 transition-all ease-in duration-300" : "w-full transition-all ease-in duration-300"}`}>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-lg font-semibold text-(--color-text-primary)">
                        {format(currentMonth, "MMMM yyyy")}
                    </h2>

                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                setPanelMode("create"); 
                                setSelectedEvent(null);
                                setSelectedOccurrence(null);
                                setIsOccurent(false);
                            }}
                            className="px-3 py-3 rounded bg-slate-800 hover:bg-slate-700 cursor-pointer"
                        >
                            Create Event
                        </button>
                        <button
                            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                            className="px-3 py-3 rounded bg-slate-800 hover:bg-slate-700 cursor-pointer"
                        >
                            ←
                        </button>
                        <button
                            onClick={() => setCurrentMonth(new Date())}
                            className="px-3 py-3 rounded bg-slate-800 hover:bg-slate-700 cursor-pointer"
                        >
                            Today
                        </button>
                        <button
                            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                            className="px-3 py-3 rounded bg-slate-800 hover:bg-slate-700 cursor-pointer"
                        >
                            →
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-7 text-sm text-slate-400 mb-2">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                        <div key={d} className="text-center">
                            {d}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-px bg-(--color-secondary) rounded-lg overflow-hidden">
                    {days.map((date) => {
                        const dayEvents = getEventsForDate(date);

                        return (
                            <div
                                key={date.toString()}
                                className={`min-h-[200px] p-2 bg-slate-900
                                    ${!isSameMonth(date, currentMonth) && "opacity-40"}
                                `}
                            >
                                <div className="flex justify-between items-center mb-1">
                                    <span
                                        className={`text-sm
                                            ${isToday(date) && "bg-indigo-500 text-white px-2 py-1 rounded-full"}
                                        `}
                                    >
                                        {format(date, "d")}
                                    </span>
                                </div>

                                <div className="space-y-1">
                                    {dayEvents.map((eventData, idx) => (
                                        <div
                                            key={`${eventData.event.id}-${eventData.occurrenceId || 'main'}-${idx}`}
                                            onClick={() => {
                                                const occurrence =
                                                    eventData.isOccurrence && eventData.occurrenceId
                                                    ? eventData.event.occurrences?.find(
                                                        (occ) => occ.id === eventData.occurrenceId
                                                        )
                                                    : undefined;

                                                openDetail(eventData.event, occurrence);
                                                setIsEditMode(false);
                                            }}
                                            className="text-xs bg-indigo-500/20 text-indigo-300 rounded px-3 py-3 truncate cursor-pointer hover:bg-indigo-500/30"
                                        >
                                            {eventData.event.title}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            {panelMode && (
                <div className="bg-(--color-surface) rounded-xl p-4 w-full md:w-1/4 transition-all duration-300 shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-(--color-text-primary)">
                            {panelMode === "create" && "Create Event"}
                            {panelMode === "detail" && "Event Detail"}
                        </h2>

                        <button
                            onClick={() => {
                                setPanelMode(null);
                                setSelectedEvent(null);
                                setSelectedOccurrence(null);
                                setIsEditMode(false);
                            }}
                            className="p-2 rounded-lg bg-(--color-primary) hover:bg-(--color-primary)/80 cursor-pointer transition"
                        >
                            <Image
                                src={icons.closeMenu}
                                alt="Close Filter"
                                width={24}
                                height={24}
                            />
                        </button>
                    </div>
                    {panelMode === "create" && (
                        <form className="space-y-4">
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-600 mb-1">Judul Agenda</label>
                                <input
                                    className="w-full border border-(--color-border) rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    placeholder="Agenda title"
                                    value={formData.title}
                                    name="title"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-600 mb-1">Tanggal Agenda</label>
                                <input
                                    type="date"
                                    className="w-full border border-(--color-border) rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    value={formData.date}
                                    name="date"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-600 mb-1">Waktu Agenda</label>
                                <input
                                    type="time"
                                    className="w-full border border-(--color-border) rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    value={formData.time}
                                    name="time"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-600 mb-1">Agenda Untuk : (opsional)</label>
                                <select
                                    name="projectId"
                                    value={formData.projectId ?? ""}
                                    onChange={(e) => {
                                        const value = e.target.value;

                                        setFormData(prev => ({
                                            ...prev,
                                            projectId: value === "" ? null : value,
                                        }));
                                    }}
                                    className="border border-(--color-border) rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                >
                                    <option value="">-- Pilih Project Tim --</option>
                                    {project.map((p: any) => (
                                        <option key={p.id} value={p.id}>
                                            {p.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="w-full flex gap-4 items-center">
                                <label className="flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        id="check" 
                                        className="sr-only peer" 
                                        checked={isOccurent}
                                        onChange={(e) => {
                                            const checked = e.target.checked;
                                            setIsOccurent(checked)
                                        }} 
                                    />
                                    <div className="
                                        relative w-14 h-8 bg-(--color-border) 
                                        peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-soft dark:peer-focus:ring-brand-soft rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-buffer 
                                        after:content-[''] after:absolute after:top-1 after:start-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all after:duration-500 
                                        peer-checked:bg-(--color-primary)"
                                    />
                                </label>
                                <span className="text-sm">
                                    Apakah Agenda Berulang?
                                </span>
                            </div>
                            {isOccurent && (
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600 mb-1">Frekuensi Pengulangan</label>
                                    <select
                                        name="frequency"
                                        value={formData?.frequency ?? ""}
                                        onChange={handleChange}
                                        className="border border-(--color-border) rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    >
                                        <option value="">-- Jenis Frequency --</option>
                                        {Object.values(AgendaFreq).map(role => (
                                            <option key={role} value={role}>{role}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            <button 
                                type="button"
                                disabled={isPending}
                                onClick={handleOpenModal}
                                className={`w-full flex items-center gap-2 px-5 py-2 rounded-lg text-white justify-center transition cursor-pointer
                                    ${isPending
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-(--color-primary) hover:bg-(--color-primary)/80 active:scale-[0.98]"
                                    }`}
                                >
                                    <Image src={icons.saveLogo} alt="Save Logo" width={18} height={18} />
                                    {isPending ? "Menyimpan..." : "Simpan Agenda"}
                            </button>
                        </form>
                    )}
                    {panelMode === "detail" && selectedEvent && (
                        <div key={`${selectedEvent.id}-${selectedOccurrence?.id || 'main'}`} className="space-y-4">
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-600 mb-1">Judul Event</label>
                                <input
                                    className="w-full border border-(--color-border) rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    value={editFormData.title}
                                    disabled={!isEditMode}
                                    onChange={(e) =>
                                        setEditFormData((prev) => ({ ...prev, title: e.target.value }))
                                    }
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-600 mb-1">Tanggal Event</label>
                                <input
                                    type="date"
                                    className="w-full border border-(--color-border) rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    value={editFormData.date}
                                    disabled={!isEditMode}
                                    onChange={(e) =>
                                        setEditFormData((prev) => ({ ...prev, date: e.target.value }))
                                    }
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-600 mb-1">Waktu Event</label>
                                <input
                                    type="time"
                                    className="w-full border border-(--color-border) rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    value={editFormData.time}
                                    disabled={!isEditMode}
                                    onChange={(e) =>
                                        setEditFormData((prev) => ({ ...prev, time: e.target.value }))
                                    }
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-600 mb-1">Agenda Untuk : (opsional)</label>
                                <select
                                    disabled={!isEditMode}
                                    value={editFormData.projectId ?? ""}
                                    onChange={(e) =>
                                        setEditFormData((prev) => ({
                                            ...prev,
                                            projectId: e.target.value || null,
                                        }))
                                    }
                                    className="border border-(--color-border) rounded-lg px-3 py-2"
                                >
                                    <option value="">-- Pilih Project --</option>
                                    {project.map((p: any) => (
                                        <option key={p.id} value={p.id}>
                                            {p.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="w-full flex gap-4 items-center">
                                <label className="flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        id="check" 
                                        className="sr-only peer" 
                                        checked={isOccurent}
                                        onChange={(e) => {
                                            const checked = e.target.checked;
                                            setIsOccurent(checked)
                                        }} 
                                    />
                                    <div className="
                                        relative w-14 h-8 bg-(--color-border) 
                                        peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-soft dark:peer-focus:ring-brand-soft rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-buffer 
                                        after:content-[''] after:absolute after:top-1 after:start-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all after:duration-500 
                                        peer-checked:bg-(--color-primary)"
                                    />
                                </label>
                                <span className="text-sm">
                                    Apakah Agenda Berulang?
                                </span>
                            </div>
                            {isOccurent && (
                                <div className="flex flex-col">
                                    <label className="text-sm font-medium text-gray-600 mb-1">Agenda Perulangan</label>
                                    <select
                                        disabled={!isEditMode}
                                        value={editFormData.frequency ?? ""}
                                        onChange={(e) =>
                                            setEditFormData((prev) => ({
                                                ...prev,
                                                frequency: e.target.value as AgendaFreq,
                                            }))
                                        }
                                        className="border border-(--color-border) rounded-lg px-3 py-2"
                                    >
                                        {Object.values(AgendaFreq).map((freq) => (
                                            <option key={freq} value={freq}>
                                                {freq}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            {!isEditMode && (
                                <div className="flex justify-between">
                                    <button
                                        onClick={() => handleDelete()}
                                        className="flex justify-center items-center text-sm gap-2 py-2 px-3 border bg-(--color-primary) text-(--color-surface) rounded-lg text-center hover:bg-(--color-primary)/80 transition cursor-pointer"
                                    >
                                        <Image
                                            src={icons.deleteLogo}
                                            alt="Delete Logo"
                                            width={20}
                                            height={20}
                                        />
                                        Delete Agenda
                                    </button>
                                    <button
                                        onClick={() => setIsEditMode(true)}
                                        className="flex justify-center items-center text-sm gap-2 py-2 px-3 bg-yellow-500 text-(--color-surface) rounded-lg text-center hover:bg-yellow-600 transition cursor-pointer"
                                    >
                                        <Image
                                            src={icons.editLogo}
                                            alt="Edit Agenda"
                                            width={20}
                                            height={20}
                                        />
                                        Edit Agenda
                                    </button>
                                </div>
                            )}
                            {isEditMode && (
                                selectedEvent.occurrences.length > 1 && selectedOccurrence ? (
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => setIsEditMode(false)}
                                            className="flex justify-center items-center text-sm gap-2 py-2 px-3 bg-yellow-500 text-(--color-surface) rounded-lg text-center hover:bg-yellow-600 transition cursor-pointer"
                                        >
                                            <Image
                                                src={icons.editLogo}
                                                alt="Edit Agenda"
                                                width={20}
                                                height={20}
                                            />
                                            Batalkan Edit Agenda
                                        </button>
                                        <div className="flex justify-between gap-2">
                                            <button
                                                onClick={handleUpdateOccurrence}
                                                className="py-2 px-2 bg-(--color-secondary) hover:bg-(--color-secondary)/90 text-white rounded-lg cursor-pointer"
                                            >
                                                Update agenda ini saja
                                            </button>

                                            <button
                                                onClick={handleUpdateAgenda}
                                                className="py-2 px-2 border-2 border-(--color-secondary) hover:bg-(--color-secondary)/10 text-(--color-secondary) rounded-lg cursor-pointer"
                                            >
                                                Update agenda berulang
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        <button
                                            onClick={() => setIsEditMode(false)}
                                            className="flex justify-center items-center text-sm gap-2 py-2 px-3 bg-yellow-500 text-(--color-surface) rounded-lg text-center hover:bg-yellow-600 transition cursor-pointer"
                                        >
                                            <Image
                                                src={icons.editLogo}
                                                alt="Edit Agenda"
                                                width={20}
                                                height={20}
                                            />
                                            Batalkan Edit Agenda
                                        </button>
                                        <button
                                            onClick={handleUpdateAgenda}
                                            className="w-full py-3 bg-(--color-secondary) text-white rounded-lg"
                                        >
                                            Update agenda
                                        </button>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
            )}
            <ConfirmationPopUpModal
                isOpen={isModalOpen}
                onAction={handleSubmit}
                onClose={() => setIsModalOpen(false)}
                type="success"
                title={"Konfirmasi Pembuatan Agenda"}
                message={"Apakah Anda yakin sudah mengisi data dengan baik"}
                activeText={"Simpan"}
                passiveText="Batal"
            />
        </div>
    );
}