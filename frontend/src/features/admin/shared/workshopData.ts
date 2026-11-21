export type Section = 'summary' | 'sales' | 'orders'
export type OrderStatus = 'Recepción' | 'Diagnóstico' | 'Esperando aprobación' | 'En reparación' | 'Listo' | 'Entregado' | 'Sin reparar'
export type Job = { title: string; technician: string; price: number; partCost: number; state: string; rate?: number; costRecorded?: boolean }
export type Budget = { version: string; amount: number; response: string; date: string }
export type RepairOrder = {
  id: string; client: string; phone: string; device: string; failure: string; accessories: string
  status: OrderStatus; received: string; technician: string; diagnosis: string; approved: number
  advance: number; location: string; nextStep: string; photos: number; pendingVerification: boolean
  jobs: Job[]; budgets: Budget[]; photoUrls?: string[]; archived?: boolean; advanceDate?: string
}
export type SaleType = 'Servicio' | 'Celular' | 'Pantalla'
export type Sale = { id: string; time: string; type: SaleType; description: string; client: string; method: string; amount: number; cost: number; reference: string; isAdvance?: boolean; notes?: string }
export type OperationsDashboardProps = {
  section: Section; onNavigate: (section: Section) => void; onExit: () => void
  onOpenPhones: () => void; onOpenScreens: () => void; onOpenTechnicians: () => void; onOpenClients: () => void
}

export const statusFlow: OrderStatus[] = ['Recepción', 'Diagnóstico', 'Esperando aprobación', 'En reparación', 'Listo', 'Entregado']
export const initialOrders: RepairOrder[] = [
  { id: '#0305', client: 'Lucía Fernández', phone: '+591 720 48126', device: 'Samsung Galaxy A54 5G', failure: 'Pantalla rota después de una caída', accessories: 'Funda transparente · sin cargador', status: 'Listo', received: '19 nov · 09:15', technician: 'Daniela Rojas', diagnosis: 'Módulo AMOLED quebrado. Placa, cámaras y carga funcionan correctamente.', approved: 1350, advance: 700, location: 'Estante entrega 02', nextStep: 'Avisar al cliente y cobrar saldo', photos: 5, pendingVerification: false, jobs: [{ title: 'Cambio AMOLED con marco', technician: 'Daniela Rojas', price: 1350, partCost: 690, state: 'Terminado' }], budgets: [{ version: 'V1', amount: 1350, response: 'Aprobado por WhatsApp', date: '19 nov · 10:02' }] },
  { id: '#0301', client: 'Carlos Méndez', phone: '+591 765 20391', device: 'Samsung Galaxy S10', failure: 'No enciende', accessories: 'Solo equipo', status: 'Diagnóstico', received: '19 nov · 10:42', technician: 'Marco Lima', diagnosis: 'Pendiente medir consumo y revisar línea principal. El equipo no permite verificar cámaras ni pantalla.', approved: 0, advance: 200, location: 'Mesa 02', nextStep: 'Completar diagnóstico y confirmar presupuesto', photos: 4, pendingVerification: true, jobs: [{ title: 'Diagnóstico de placa', technician: 'Marco Lima', price: 180, partCost: 0, state: 'En proceso' }, { title: 'Reparación de placa', technician: 'Marco Lima', price: 500, partCost: 95, state: 'Pendiente' }], budgets: [{ version: 'V1', amount: 550, response: 'Cliente pidió revisar otra opción', date: '19 nov · 11:30' }, { version: 'V2', amount: 680, response: 'Esperando respuesta', date: '19 nov · 15:05' }] },
  { id: '#0307', client: 'Elena Poma', phone: '+591 777 31082', device: 'iPhone 14 Pro', failure: 'Cámara vibra al enfocar', accessories: 'Funda negra', status: 'Esperando aprobación', received: '19 nov · 13:18', technician: 'Ariel Vargas', diagnosis: 'Estabilizador del módulo principal dañado.', approved: 0, advance: 0, location: 'Gaveta B-04', nextStep: 'Esperar aprobación del presupuesto', photos: 5, pendingVerification: false, jobs: [{ title: 'Cambio de cámara principal', technician: 'Ariel Vargas', price: 980, partCost: 610, state: 'Sin aprobar' }], budgets: [{ version: 'V1', amount: 980, response: 'Enviado por WhatsApp', date: '19 nov · 14:02' }] },
  { id: '#0299', client: 'René Flores', phone: '+591 706 51244', device: 'Redmi Note 11', failure: 'No carga y se calienta', accessories: 'Cable USB-C', status: 'En reparación', received: '18 nov · 17:30', technician: 'Ariel Vargas', diagnosis: 'Conector sulfatado y batería degradada.', approved: 570, advance: 300, location: 'Mesa 03', nextStep: 'Cambiar conector y ejecutar prueba térmica', photos: 5, pendingVerification: false, jobs: [{ title: 'Cambio de conector', technician: 'Ariel Vargas', price: 320, partCost: 85, state: 'En proceso' }, { title: 'Cambio de batería', technician: 'Ariel Vargas', price: 250, partCost: 130, state: 'Pendiente' }], budgets: [{ version: 'V1', amount: 570, response: 'Aprobado', date: '18 nov · 18:12' }] },
  { id: '#0294', client: 'Valeria Choque', phone: '+591 712 99604', device: 'iPhone 12', failure: 'Línea verde intermitente', accessories: 'Caja y cable', status: 'En reparación', received: '18 nov · 14:05', technician: 'Daniela Rojas', diagnosis: 'Reingreso por garantía. Comparar panel y fotografías internas.', approved: 0, advance: 0, location: 'Mesa garantía', nextStep: 'Probar panel de reemplazo', photos: 5, pendingVerification: false, jobs: [{ title: 'Revisión de garantía', technician: 'Daniela Rojas', price: 0, partCost: 0, state: 'En proceso' }], budgets: [{ version: 'V1', amount: 0, response: 'Aprobado · garantía', date: '18 nov · 14:05' }] },
  { id: '#0289', client: 'José Mamani', phone: '+591 681 00318', device: 'Moto G84', failure: 'Mojado · no enciende', accessories: 'Solo equipo', status: 'Sin reparar', received: '17 nov · 09:25', technician: 'Marco Lima', diagnosis: 'Corrosión extensa en placa. Reparación no recomendable.', approved: 80, advance: 80, location: 'Estante devolución', nextStep: 'Entregar sin reparar', photos: 6, pendingVerification: true, jobs: [{ title: 'Diagnóstico por humedad', technician: 'Marco Lima', price: 80, partCost: 15, state: 'Terminado' }], budgets: [{ version: 'V1', amount: 620, response: 'Rechazado por cliente', date: '17 nov · 16:40' }] },
]

export const initialSales: Sale[] = [
  { id: 'MV-084', time: '18:22', type: 'Celular', description: 'Samsung Galaxy S22 · 128 GB', client: 'Andrea Pérez', method: 'QR', amount: 2350, cost: 1740, reference: 'ZT-0250 · unidad anterior' },
  { id: 'SV-305', time: '17:10', type: 'Servicio', description: 'Cambio AMOLED Galaxy A54', client: 'Lucía Fernández', method: 'Efectivo', amount: 700, cost: 0, reference: '#0305 · anticipo' },
  { id: 'PV-118', time: '15:48', type: 'Pantalla', description: 'Pantalla Incell iPhone 11', client: 'Taller Norte', method: 'Transferencia', amount: 490, cost: 305, reference: 'PT-0409' },
  { id: 'SV-301', time: '14:32', type: 'Servicio', description: 'Diagnóstico Samsung S10', client: 'Carlos Méndez', method: 'Efectivo', amount: 200, cost: 0, reference: '#0301 · anticipo' },
  { id: 'PV-115', time: '12:26', type: 'Pantalla', description: 'AMOLED Redmi Note 11 con marco', client: 'Luis Quisbert', method: 'QR', amount: 620, cost: 405, reference: 'PT-0401' },
  { id: 'SV-297', time: '11:05', type: 'Servicio', description: 'Conector de carga iPhone 13', client: 'Diego Arce', method: 'Mixto', amount: 520, cost: 140, reference: '#0297 · saldo final' },
]


export type DeviceState = OrderStatus | 'En diagnóstico' | 'Listo para entrega' | 'Garantía'
export type ClientDevice = {
  order: string; model: string; state: DeviceState; received: string; fault: string
  technician: string; total: number; balance: number; nextStep: string
}
export type Client = {
  id: string; name: string; phone: string; email: string; neighborhood: string
  joined: string; lastContact: string; notes: string; devices: ClientDevice[]
}
export type ClientFilter = 'Todos' | 'Con equipo' | 'Saldo pendiente' | 'Garantía'
export type ClientDashboardProps = { onExit: () => void; onOpenPhones: () => void; onOpenScreens: () => void; onOpenTechnicians: () => void; onOpenOperations: (section: 'summary' | 'sales' | 'orders') => void }

export const initialClients: Client[] = [
  { id: 'CL-0148', name: 'Lucía Fernández', phone: '+591 720 48126', email: 'lucia.fernandez@email.com', neighborhood: 'Sopocachi', joined: 'Cliente desde marzo de 2025', lastContact: 'Hoy · 15:20', notes: 'Prefiere mensajes por WhatsApp. Confirmar antes de reemplazar piezas adicionales.', devices: [
    { order: '#0305', model: 'Samsung Galaxy A54 5G', state: 'Listo para entrega', received: '19 nov · 09:15', fault: 'Pantalla rota después de una caída', technician: 'Daniela Rojas', total: 1350, balance: 650, nextStep: 'Avisar que puede recoger el equipo' },
    { order: '#0214', model: 'Xiaomi Redmi Note 10', state: 'Entregado', received: '08 ago · 11:40', fault: 'Cambio de batería', technician: 'Ariel Vargas', total: 380, balance: 0, nextStep: 'Trabajo finalizado' },
  ] },
  { id: 'CL-0142', name: 'Carlos Méndez', phone: '+591 765 20391', email: '', neighborhood: 'Villa Fátima', joined: 'Cliente desde enero de 2025', lastContact: 'Hoy · 12:08', notes: 'Llamar después de las 17:00. El equipo se recibió sin cargador.', devices: [
    { order: '#0301', model: 'Samsung Galaxy S10', state: 'En diagnóstico', received: '19 nov · 10:42', fault: 'No enciende · posible falla de placa', technician: 'Marco Lima', total: 680, balance: 480, nextStep: 'Esperar confirmación del diagnóstico' },
  ] },
  { id: 'CL-0135', name: 'Valeria Choque', phone: '+591 712 99604', email: 'vchoque@email.com', neighborhood: 'Miraflores', joined: 'Cliente desde noviembre de 2024', lastContact: 'Ayer · 18:30', notes: 'Conserva el comprobante. Reclamo revisado sin golpes ni humedad.', devices: [
    { order: '#0294', model: 'iPhone 12', state: 'Garantía', received: '18 nov · 14:05', fault: 'Pantalla presenta línea verde intermitente', technician: 'Daniela Rojas', total: 1250, balance: 0, nextStep: 'Comparar fotografías internas y probar panel' },
  ] },
  { id: 'CL-0128', name: 'Diego Arce', phone: '+591 680 11742', email: '', neighborhood: 'Calacoto', joined: 'Cliente desde septiembre de 2024', lastContact: '17 nov · 10:12', notes: 'Solicita presupuesto antes de cualquier intervención.', devices: [
    { order: '#0297', model: 'iPhone 13', state: 'Entregado', received: '18 nov · 16:20', fault: 'Conector de carga intermitente', technician: 'Marco Lima', total: 520, balance: 0, nextStep: 'Trabajo finalizado' },
  ] },
  { id: 'CL-0119', name: 'María Elena Quispe', phone: '+591 699 43018', email: 'maria.quispe@email.com', neighborhood: 'Obrajes', joined: 'Cliente desde junio de 2024', lastContact: '14 nov · 09:45', notes: 'Sin observaciones pendientes.', devices: [] },
]


export type PaymentTiming = 'Mismo día' | 'Fin de semana' | 'Posteriormente'
export type Technician = {
  id: string; name: string; initials: string; specialty: string; turn: string
  rate: number; owner: boolean; paymentTiming: PaymentTiming
}
export type Work = {
  id: string; technicianId: string; order: string; device: string; service: string
  advanceDate: string; charged: number; partCost: number; paid: boolean; location: string
}

export const initialTechnicians: Technician[] = [
  { id: 'tec-01', name: 'Marco Lima', initials: 'ML', specialty: 'Microsoldadura', turn: '08:30–17:30', rate: 50, owner: false, paymentTiming: 'Posteriormente' },
  { id: 'tec-02', name: 'Daniela Rojas', initials: 'DR', specialty: 'Pantallas y diagnóstico', turn: '09:00–18:00', rate: 50, owner: false, paymentTiming: 'Posteriormente' },
  { id: 'tec-03', name: 'Ariel Vargas', initials: 'AV', specialty: 'Android y software', turn: '10:00–19:00', rate: 50, owner: false, paymentTiming: 'Posteriormente' },
  { id: 'owner', name: 'Propietaria', initials: 'ZT', specialty: 'Ventas del taller', turn: 'Administración', rate: 0, owner: true, paymentTiming: 'Mismo día' },
]

export const initialWorks: Work[] = [
  { id: 'TR-301', technicianId: 'tec-01', order: '#0301', device: 'Samsung Galaxy S10', service: 'Reparación de placa · no enciende', advanceDate: '19 nov · 10:42', charged: 680, partCost: 95, paid: false, location: 'Mesa 02' },
  { id: 'TR-297', technicianId: 'tec-01', order: '#0297', device: 'iPhone 13', service: 'Cambio de conector de carga', advanceDate: '18 nov · 16:20', charged: 520, partCost: 140, paid: true, location: 'Entregado' },
  { id: 'TR-288', technicianId: 'tec-01', order: '#0288', device: 'Poco X3 Pro', service: 'Reballing de CPU', advanceDate: '17 nov · 11:05', charged: 750, partCost: 80, paid: false, location: 'Control final' },
  { id: 'TR-305', technicianId: 'tec-02', order: '#0305', device: 'Samsung Galaxy A54', service: 'Cambio AMOLED con marco', advanceDate: '19 nov · 14:10', charged: 1350, partCost: 690, paid: false, location: 'Mesa 01' },
  { id: 'TR-294', technicianId: 'tec-02', order: '#0294', device: 'iPhone 11', service: 'Cambio de pantalla Incell', advanceDate: '18 nov · 12:35', charged: 720, partCost: 305, paid: true, location: 'Entregado' },
  { id: 'TR-299', technicianId: 'tec-03', order: '#0299', device: 'Redmi Note 11', service: 'Recuperación de sistema y datos', advanceDate: '19 nov · 09:18', charged: 320, partCost: 0, paid: false, location: 'Software 01' },
  { id: 'TR-291', technicianId: 'tec-03', order: '#0291', device: 'Moto G54', service: 'Diagnóstico de consumo', advanceDate: '17 nov · 17:40', charged: 180, partCost: 20, paid: true, location: 'Entregado' },
  { id: 'VT-084', technicianId: 'owner', order: 'Venta #084', device: 'iPhone 12 usado', service: 'Venta directa de la propietaria', advanceDate: '19 nov · 13:25', charged: 3100, partCost: 2450, paid: true, location: 'Vendido' },
]
