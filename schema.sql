-- Create tables for the healthcare management system

-- Patients table
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  cpf TEXT NOT NULL UNIQUE,
  sus_card TEXT UNIQUE,
  birth_date DATE NOT NULL,
  gender TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  mother_name TEXT NOT NULL,
  profession TEXT,
  education TEXT,
  record_number TEXT,
  is_pregnant BOOLEAN DEFAULT FALSE,
  is_hypertensive BOOLEAN DEFAULT FALSE,
  is_diabetic BOOLEAN DEFAULT FALSE,
  other_groups TEXT,
  observations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exams table
CREATE TABLE exams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  exam_type TEXT NOT NULL,
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Agendado', 'Marcado', 'Marcado - Aguardando protocolo', 'Concluído', 'Cancelado')),
  result_url TEXT,
  result_text TEXT,
  observations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pregnancy monitoring table
CREATE TABLE pregnancy_monitoring (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  last_period_date DATE NOT NULL,
  expected_birth_date DATE NOT NULL,
  pregnancy_number INTEGER NOT NULL,
  risk_classification TEXT NOT NULL CHECK (risk_classification IN ('baixo', 'alto')),
  first_appointment_date DATE,
  has_pregnancy_card BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pregnancy exams tracking
CREATE TABLE pregnancy_exams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pregnancy_id UUID NOT NULL REFERENCES pregnancy_monitoring(id) ON DELETE CASCADE,
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(pregnancy_id, exam_id)
);

-- Chronic conditions monitoring
CREATE TABLE chronic_monitoring (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  condition_type TEXT NOT NULL CHECK (condition_type IN ('hypertension', 'diabetes')),
  medications TEXT,
  treatment_adherence TEXT NOT NULL CHECK (treatment_adherence IN ('Sim', 'Não', 'Parcial')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(patient_id, condition_type)
);

-- Blood pressure records
CREATE TABLE blood_pressure_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chronic_monitoring_id UUID NOT NULL REFERENCES chronic_monitoring(id) ON DELETE CASCADE,
  measurement_date TIMESTAMP WITH TIME ZONE NOT NULL,
  systolic INTEGER NOT NULL,
  diastolic INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Glucose records
CREATE TABLE glucose_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chronic_monitoring_id UUID NOT NULL REFERENCES chronic_monitoring(id) ON DELETE CASCADE,
  measurement_date TIMESTAMP WITH TIME ZONE NOT NULL,
  glucose_level NUMERIC NOT NULL,
  measurement_type TEXT NOT NULL CHECK (measurement_type IN ('Jejum', 'Pós-prandial', 'Casual')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  appointment_type TEXT NOT NULL,
  professional TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL CHECK (status IN ('Agendado', 'Realizado', 'Cancelado')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_patients_full_name ON patients(full_name);
CREATE INDEX idx_patients_cpf ON patients(cpf);
CREATE INDEX idx_patients_sus_card ON patients(sus_card);
CREATE INDEX idx_exams_patient_id ON exams(patient_id);
CREATE INDEX idx_exams_status ON exams(status);
CREATE INDEX idx_pregnancy_patient_id ON pregnancy_monitoring(patient_id);
CREATE INDEX idx_chronic_patient_id ON chronic_monitoring(patient_id);
CREATE INDEX idx_blood_pressure_chronic_id ON blood_pressure_records(chronic_monitoring_id);
CREATE INDEX idx_glucose_chronic_id ON glucose_records(chronic_monitoring_id);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);

-- Create Row Level Security policies
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE pregnancy_monitoring ENABLE ROW LEVEL SECURITY;
ALTER TABLE pregnancy_exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE chronic_monitoring ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_pressure_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE glucose_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Authenticated users can read all patients" ON patients
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert patients" ON patients
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update patients" ON patients
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete patients" ON patients
  FOR DELETE USING (auth.role() = 'authenticated');

-- Similar policies for other tables
CREATE POLICY "Authenticated users can read all exams" ON exams
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert exams" ON exams
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update exams" ON exams
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete exams" ON exams
  FOR DELETE USING (auth.role() = 'authenticated');

-- And so on for other tables...
