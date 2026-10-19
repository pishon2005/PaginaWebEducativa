-- ============================================================================
-- ESQUEMA COMPLETO DE BASE DE DATOS PARA PROYECTOCLASES (PostgreSQL)
-- Generado a partir del esquema Drizzle ORM del proyecto
-- ============================================================================

-- Configuración inicial
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

-- ============================================================================
-- EXTENSIONES
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- TABLA: roles
-- ============================================================================
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(200),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para roles
CREATE INDEX idx_roles_nombre ON roles(nombre);

-- ============================================================================
-- TABLA: usuarios
-- ============================================================================
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    foto_perfil VARCHAR(500),
    telefono VARCHAR(20),
    pais VARCHAR(100),
    idioma_preferido VARCHAR(10) NOT NULL DEFAULT 'es',
    codigo_alumno VARCHAR(20) UNIQUE,
    rol_id UUID NOT NULL REFERENCES roles(id),
    activo BOOLEAN NOT NULL DEFAULT true,
    email_verificado BOOLEAN NOT NULL DEFAULT false,
    primer_login BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para usuarios
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_rol_id ON usuarios(rol_id);
CREATE INDEX idx_usuarios_codigo_alumno ON usuarios(codigo_alumno);
CREATE INDEX idx_usuarios_activo ON usuarios(activo);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_usuarios_updated_at
    BEFORE UPDATE ON usuarios
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TABLA: perfiles_profesor
-- ============================================================================
CREATE TABLE perfiles_profesor (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL UNIQUE REFERENCES usuarios(id) ON DELETE CASCADE,
    biografia TEXT,
    especialidades JSONB DEFAULT '[]'::jsonb,
    certificaciones JSONB DEFAULT '[]'::jsonb,
    linkedin_url VARCHAR(500),
    años_experiencia INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para perfiles_profesor
CREATE INDEX idx_perfiles_profesor_usuario_id ON perfiles_profesor(usuario_id);

CREATE TRIGGER update_perfiles_profesor_updated_at
    BEFORE UPDATE ON perfiles_profesor
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TABLA: cursos
-- ============================================================================
CREATE TABLE cursos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(200) NOT NULL UNIQUE,
    titulo VARCHAR(200) NOT NULL,
    descripcion_corta VARCHAR(500),
    descripcion_larga TEXT,
    imagen_portada VARCHAR(500),
    precio DECIMAL(10, 2) NOT NULL DEFAULT 0,
    moneda VARCHAR(3) NOT NULL DEFAULT 'PEN',
    duracion_horas INTEGER,
    nivel VARCHAR(20) NOT NULL DEFAULT 'principiante',
    profesor_id UUID NOT NULL REFERENCES usuarios(id),
    publicado BOOLEAN NOT NULL DEFAULT false,
    certificado_activo BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para cursos
CREATE INDEX idx_cursos_slug ON cursos(slug);
CREATE INDEX idx_cursos_profesor_id ON cursos(profesor_id);
CREATE INDEX idx_cursos_publicado ON cursos(publicado);
CREATE INDEX idx_cursos_nivel ON cursos(nivel);

CREATE TRIGGER update_cursos_updated_at
    BEFORE UPDATE ON cursos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TABLA: semanas
-- ============================================================================
CREATE TABLE semanas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    curso_id UUID NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
    numero INTEGER NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para semanas
CREATE INDEX idx_semanas_curso_id ON semanas(curso_id);
CREATE UNIQUE INDEX idx_semanas_curso_numero ON semanas(curso_id, numero);

-- ============================================================================
-- TABLA: clases
-- ============================================================================
CREATE TABLE clases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    semana_id UUID NOT NULL REFERENCES semanas(id) ON DELETE CASCADE,
    numero INTEGER NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    video_url VARCHAR(500),
    duracion_minutos INTEGER,
    publicado BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para clases
CREATE INDEX idx_clases_semana_id ON clases(semana_id);
CREATE UNIQUE INDEX idx_clases_semana_numero ON clases(semana_id, numero);
CREATE INDEX idx_clases_publicado ON clases(publicado);

-- ============================================================================
-- TABLA: materiales
-- ============================================================================
CREATE TABLE materiales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clase_id UUID NOT NULL REFERENCES clases(id) ON DELETE CASCADE,
    nombre VARCHAR(200) NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    url VARCHAR(500) NOT NULL,
    tamaño_bytes BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para materiales
CREATE INDEX idx_materiales_clase_id ON materiales(clase_id);

-- ============================================================================
-- TABLA: inscripciones
-- ============================================================================
CREATE TABLE inscripciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alumno_id UUID NOT NULL REFERENCES usuarios(id),
    curso_id UUID NOT NULL REFERENCES cursos(id),
    fecha_inscripcion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    progreso_porcentaje INTEGER NOT NULL DEFAULT 0,
    completado BOOLEAN NOT NULL DEFAULT false,
    certificado_emitido BOOLEAN NOT NULL DEFAULT false,
    certificado_url VARCHAR(500)
);

-- Índices para inscripciones
CREATE INDEX idx_inscripciones_alumno_id ON inscripciones(alumno_id);
CREATE INDEX idx_inscripciones_curso_id ON inscripciones(curso_id);
CREATE UNIQUE INDEX idx_inscripciones_alumno_curso ON inscripciones(alumno_id, curso_id);
CREATE INDEX idx_inscripciones_completado ON inscripciones(completado);

-- ============================================================================
-- TABLA: pagos
-- ============================================================================
CREATE TABLE pagos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alumno_id UUID REFERENCES usuarios(id),
    curso_id UUID NOT NULL REFERENCES cursos(id),
    monto DECIMAL(10, 2) NOT NULL,
    moneda VARCHAR(3) NOT NULL DEFAULT 'PEN',
    metodo_pago VARCHAR(20) NOT NULL DEFAULT 'yape',
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente',
    voucher_url VARCHAR(500),
    referencia_externa VARCHAR(200),
    aprobado_por UUID REFERENCES usuarios(id),
    fecha_pago TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    fecha_aprobacion TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para pagos
CREATE INDEX idx_pagos_alumno_id ON pagos(alumno_id);
CREATE INDEX idx_pagos_curso_id ON pagos(curso_id);
CREATE INDEX idx_pagos_estado ON pagos(estado);
CREATE INDEX idx_pagos_fecha_pago ON pagos(fecha_pago);
CREATE INDEX idx_pagos_referencia_externa ON pagos(referencia_externa);

-- ============================================================================
-- TABLA: tareas
-- ============================================================================
CREATE TABLE tareas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    curso_id UUID NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
    semana_id UUID REFERENCES semanas(id) ON DELETE SET NULL,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    tipo VARCHAR(20) NOT NULL DEFAULT 'individual',
    fecha_inicio TIMESTAMPTZ NOT NULL,
    fecha_limite TIMESTAMPTZ NOT NULL,
    permitir_reenvio BOOLEAN NOT NULL DEFAULT false,
    max_reenvios INTEGER NOT NULL DEFAULT 0,
    peso_nota DECIMAL(5, 2) NOT NULL DEFAULT 0,
    rubrica JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para tareas
CREATE INDEX idx_tareas_curso_id ON tareas(curso_id);
CREATE INDEX idx_tareas_semana_id ON tareas(semana_id);
CREATE INDEX idx_tareas_fecha_limite ON tareas(fecha_limite);

CREATE TRIGGER update_tareas_updated_at
    BEFORE UPDATE ON tareas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TABLA: entregas
-- ============================================================================
CREATE TABLE entregas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tarea_id UUID NOT NULL REFERENCES tareas(id) ON DELETE CASCADE,
    alumno_id UUID NOT NULL REFERENCES usuarios(id),
    archivo_url VARCHAR(500),
    comentario_alumno TEXT,
    comentario_profesor TEXT,
    nota DECIMAL(5, 2),
    intento_numero INTEGER NOT NULL DEFAULT 1,
    estado VARCHAR(20) NOT NULL DEFAULT 'entregado',
    fecha_entrega TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    fecha_calificacion TIMESTAMPTZ
);

-- Índices para entregas
CREATE INDEX idx_entregas_tarea_id ON entregas(tarea_id);
CREATE INDEX idx_entregas_alumno_id ON entregas(alumno_id);
CREATE UNIQUE INDEX idx_entregas_tarea_alumno_intento ON entregas(tarea_id, alumno_id, intento_numero);
CREATE INDEX idx_entregas_estado ON entregas(estado);

-- ============================================================================
-- TABLA: quizzes
-- ============================================================================
CREATE TABLE quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    curso_id UUID NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
    semana_id UUID REFERENCES semanas(id) ON DELETE SET NULL,
    titulo VARCHAR(200) NOT NULL,
    descripcion TEXT,
    tiempo_limite_minutos INTEGER,
    intentos_maximos INTEGER NOT NULL DEFAULT 1,
    mostrar_respuestas BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para quizzes
CREATE INDEX idx_quizzes_curso_id ON quizzes(curso_id);
CREATE INDEX idx_quizzes_semana_id ON quizzes(semana_id);

-- ============================================================================
-- TABLA: quiz_preguntas
-- ============================================================================
CREATE TABLE quiz_preguntas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    pregunta TEXT NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    opciones JSONB NOT NULL,
    puntaje DECIMAL(5, 2) NOT NULL,
    orden INTEGER NOT NULL
);

-- Índices para quiz_preguntas
CREATE INDEX idx_quiz_preguntas_quiz_id ON quiz_preguntas(quiz_id);
CREATE UNIQUE INDEX idx_quiz_preguntas_quiz_orden ON quiz_preguntas(quiz_id, orden);

-- ============================================================================
-- TABLA: quiz_intentos
-- ============================================================================
CREATE TABLE quiz_intentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id),
    alumno_id UUID NOT NULL REFERENCES usuarios(id),
    respuestas JSONB,
    nota DECIMAL(5, 2),
    intento_numero INTEGER NOT NULL DEFAULT 1,
    fecha_inicio TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    fecha_fin TIMESTAMPTZ
);

-- Índices para quiz_intentos
CREATE INDEX idx_quiz_intentos_quiz_id ON quiz_intentos(quiz_id);
CREATE INDEX idx_quiz_intentos_alumno_id ON quiz_intentos(alumno_id);
CREATE UNIQUE INDEX idx_quiz_intentos_quiz_alumno_intento ON quiz_intentos(quiz_id, alumno_id, intento_numero);

-- ============================================================================
-- TABLA: conversaciones
-- ============================================================================
CREATE TABLE conversaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo VARCHAR(20) NOT NULL DEFAULT 'privada',
    curso_id UUID REFERENCES cursos(id) ON DELETE CASCADE,
    nombre VARCHAR(200),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para conversaciones
CREATE INDEX idx_conversaciones_curso_id ON conversaciones(curso_id);
CREATE INDEX idx_conversaciones_tipo ON conversaciones(tipo);

-- ============================================================================
-- TABLA: conversacion_participantes
-- ============================================================================
CREATE TABLE conversacion_participantes (
    conversacion_id UUID NOT NULL REFERENCES conversaciones(id) ON DELETE CASCADE,
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    PRIMARY KEY (conversacion_id, usuario_id)
);

-- Índices para conversacion_participantes
CREATE INDEX idx_conversacion_participantes_usuario_id ON conversacion_participantes(usuario_id);

-- ============================================================================
-- TABLA: mensajes
-- ============================================================================
CREATE TABLE mensajes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversacion_id UUID NOT NULL REFERENCES conversaciones(id) ON DELETE CASCADE,
    remitente_id UUID NOT NULL REFERENCES usuarios(id),
    contenido TEXT,
    archivo_url VARCHAR(500),
    leido BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para mensajes
CREATE INDEX idx_mensajes_conversacion_id ON mensajes(conversacion_id);
CREATE INDEX idx_mensajes_remitente_id ON mensajes(remitente_id);
CREATE INDEX idx_mensajes_created_at ON mensajes(created_at);
CREATE INDEX idx_mensajes_leido ON mensajes(leido);

-- ============================================================================
-- TABLA: foro_temas
-- ============================================================================
CREATE TABLE foro_temas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    curso_id UUID NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
    semana_id UUID REFERENCES semanas(id) ON DELETE SET NULL,
    autor_id UUID NOT NULL REFERENCES usuarios(id),
    titulo VARCHAR(300) NOT NULL,
    contenido TEXT NOT NULL,
    fijado BOOLEAN NOT NULL DEFAULT false,
    cerrado BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para foro_temas
CREATE INDEX idx_foro_temas_curso_id ON foro_temas(curso_id);
CREATE INDEX idx_foro_temas_semana_id ON foro_temas(semana_id);
CREATE INDEX idx_foro_temas_autor_id ON foro_temas(autor_id);
CREATE INDEX idx_foro_temas_fijado ON foro_temas(fijado);
CREATE INDEX idx_foro_temas_cerrado ON foro_temas(cerrado);

CREATE TRIGGER update_foro_temas_updated_at
    BEFORE UPDATE ON foro_temas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TABLA: foro_respuestas
-- ============================================================================
CREATE TABLE foro_respuestas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tema_id UUID NOT NULL REFERENCES foro_temas(id) ON DELETE CASCADE,
    autor_id UUID NOT NULL REFERENCES usuarios(id),
    contenido TEXT NOT NULL,
    es_solucion BOOLEAN NOT NULL DEFAULT false,
    votos INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para foro_respuestas
CREATE INDEX idx_foro_respuestas_tema_id ON foro_respuestas(tema_id);
CREATE INDEX idx_foro_respuestas_autor_id ON foro_respuestas(autor_id);
CREATE INDEX idx_foro_respuestas_es_solucion ON foro_respuestas(es_solucion);

-- ============================================================================
-- TABLA: notificaciones
-- ============================================================================
CREATE TABLE notificaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    tipo VARCHAR(50) NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    mensaje TEXT,
    url_destino VARCHAR(500),
    leida BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para notificaciones
CREATE INDEX idx_notificaciones_usuario_id ON notificaciones(usuario_id);
CREATE INDEX idx_notificaciones_leida ON notificaciones(leida);
CREATE INDEX idx_notificaciones_tipo ON notificaciones(tipo);
CREATE INDEX idx_notificaciones_created_at ON notificaciones(created_at);

-- ============================================================================
-- DATOS SEMILLA (SEED DATA)
-- ============================================================================

-- Roles del sistema
INSERT INTO roles (nombre, descripcion) VALUES
    ('superadmin', 'Superadministrador con acceso total a la plataforma'),
    ('admin', 'Administrador de la institución'),
    ('profesor', 'Docente que imparte cursos'),
    ('alumno', 'Estudiante inscrito en cursos')
ON CONFLICT (nombre) DO NOTHING;

-- ============================================================================
-- VISTAS ÚTILES
-- ============================================================================

-- Vista: Cursos con información del profesor
CREATE OR REPLACE VIEW vista_cursos_con_profesor AS
SELECT
    c.id,
    c.slug,
    c.titulo,
    c.descripcion_corta,
    c.descripcion_larga,
    c.imagen_portada,
    c.precio,
    c.moneda,
    c.duracion_horas,
    c.nivel,
    c.publicado,
    c.certificado_activo,
    c.created_at,
    c.updated_at,
    u.id AS profesor_id,
    u.nombre AS profesor_nombre,
    u.apellido AS profesor_apellido,
    u.email AS profesor_email,
    pp.biografia AS profesor_biografia,
    pp.especialidades AS profesor_especialidades,
    pp.años_experiencia AS profesor_años_experiencia
FROM cursos c
JOIN usuarios u ON c.profesor_id = u.id
LEFT JOIN perfiles_profesor pp ON u.id = pp.usuario_id;

-- Vista: Inscripciones con detalles de alumno y curso
CREATE OR REPLACE VIEW vista_inscripciones_detalle AS
SELECT
    i.id,
    i.fecha_inscripcion,
    i.progreso_porcentaje,
    i.completado,
    i.certificado_emitido,
    i.certificado_url,
    u.id AS alumno_id,
    u.nombre AS alumno_nombre,
    u.apellido AS alumno_apellido,
    u.email AS alumno_email,
    u.codigo_alumno,
    c.id AS curso_id,
    c.titulo AS curso_titulo,
    c.slug AS curso_slug,
    c.precio AS curso_precio,
    c.moneda AS curso_moneda
FROM inscripciones i
JOIN usuarios u ON i.alumno_id = u.id
JOIN cursos c ON i.curso_id = c.id;

-- Vista: Pagos con detalles
CREATE OR REPLACE VIEW vista_pagos_detalle AS
SELECT
    p.id,
    p.monto,
    p.moneda,
    p.metodo_pago,
    p.estado,
    p.voucher_url,
    p.referencia_externa,
    p.fecha_pago,
    p.fecha_aprobacion,
    u_alumno.id AS alumno_id,
    u_alumno.nombre AS alumno_nombre,
    u_alumno.apellido AS alumno_apellido,
    u_alumno.email AS alumno_email,
    c.id AS curso_id,
    c.titulo AS curso_titulo,
    u_aprobador.id AS aprobador_id,
    u_aprobador.nombre AS aprobador_nombre,
    u_aprobador.apellido AS aprobador_apellido
FROM pagos p
LEFT JOIN usuarios u_alumno ON p.alumno_id = u_alumno.id
JOIN cursos c ON p.curso_id = c.id
LEFT JOIN usuarios u_aprobador ON p.aprobado_por = u_aprobador.id;

-- Vista: Tareas con información de curso y semana
CREATE OR REPLACE VIEW vista_tareas_detalle AS
SELECT
    t.id,
    t.titulo,
    t.descripcion,
    t.tipo,
    t.fecha_inicio,
    t.fecha_limite,
    t.permitir_reenvio,
    t.max_reenvios,
    t.peso_nota,
    t.rubrica,
    t.created_at,
    t.updated_at,
    c.id AS curso_id,
    c.titulo AS curso_titulo,
    s.id AS semana_id,
    s.numero AS semana_numero,
    s.titulo AS semana_titulo
FROM tareas t
JOIN cursos c ON t.curso_id = c.id
LEFT JOIN semanas s ON t.semana_id = s.id;

-- Vista: Entregas con detalles
CREATE OR REPLACE VIEW vista_entregas_detalle AS
SELECT
    e.id,
    e.archivo_url,
    e.comentario_alumno,
    e.comentario_profesor,
    e.nota,
    e.intento_numero,
    e.estado,
    e.fecha_entrega,
    e.fecha_calificacion,
    t.id AS tarea_id,
    t.titulo AS tarea_titulo,
    t.fecha_limite AS tarea_fecha_limite,
    u.id AS alumno_id,
    u.nombre AS alumno_nombre,
    u.apellido AS alumno_apellido,
    u.email AS alumno_email
FROM entregas e
JOIN tareas t ON e.tarea_id = t.id
JOIN usuarios u ON e.alumno_id = u.id;

-- Vista: Quizzes con detalles
CREATE OR REPLACE VIEW vista_quizzes_detalle AS
SELECT
    q.id,
    q.titulo,
    q.descripcion,
    q.tiempo_limite_minutos,
    q.intentos_maximos,
    q.mostrar_respuestas,
    q.created_at,
    c.id AS curso_id,
    c.titulo AS curso_titulo,
    s.id AS semana_id,
    s.numero AS semana_numero,
    s.titulo AS semana_titulo
FROM quizzes q
JOIN cursos c ON q.curso_id = c.id
LEFT JOIN semanas s ON q.semana_id = s.id;

-- Vista: Intentos de quiz con detalles
CREATE OR REPLACE VIEW vista_quiz_intentos_detalle AS
SELECT
    qi.id,
    qi.respuestas,
    qi.nota,
    qi.intento_numero,
    qi.fecha_inicio,
    qi.fecha_fin,
    q.id AS quiz_id,
    q.titulo AS quiz_titulo,
    u.id AS alumno_id,
    u.nombre AS alumno_nombre,
    u.apellido AS alumno_apellido,
    u.email AS alumno_email
FROM quiz_intentos qi
JOIN quizzes q ON qi.quiz_id = q.id
JOIN usuarios u ON qi.alumno_id = u.id;

-- Vista: Mensajes con detalles
CREATE OR REPLACE VIEW vista_mensajes_detalle AS
SELECT
    m.id,
    m.contenido,
    m.archivo_url,
    m.leido,
    m.created_at,
    c.id AS conversacion_id,
    c.tipo AS conversacion_tipo,
    c.nombre AS conversacion_nombre,
    u.id AS remitente_id,
    u.nombre AS remitente_nombre,
    u.apellido AS remitente_apellido,
    u.foto_perfil AS remitente_foto
FROM mensajes m
JOIN conversaciones c ON m.conversacion_id = c.id
JOIN usuarios u ON m.remitente_id = u.id;

-- Vista: Temas de foro con detalles
CREATE OR REPLACE VIEW vista_foro_temas_detalle AS
SELECT
    ft.id,
    ft.titulo,
    ft.contenido,
    ft.fijado,
    ft.cerrado,
    ft.created_at,
    ft.updated_at,
    c.id AS curso_id,
    c.titulo AS curso_titulo,
    s.id AS semana_id,
    s.numero AS semana_numero,
    s.titulo AS semana_titulo,
    u.id AS autor_id,
    u.nombre AS autor_nombre,
    u.apellido AS autor_apellido,
    u.foto_perfil AS autor_foto
FROM foro_temas ft
JOIN cursos c ON ft.curso_id = c.id
LEFT JOIN semanas s ON ft.semana_id = s.id
JOIN usuarios u ON ft.autor_id = u.id;

-- Vista: Respuestas de foro con detalles
CREATE OR REPLACE VIEW vista_foro_respuestas_detalle AS
SELECT
    fr.id,
    fr.contenido,
    fr.es_solucion,
    fr.votos,
    fr.created_at,
    ft.id AS tema_id,
    ft.titulo AS tema_titulo,
    u.id AS autor_id,
    u.nombre AS autor_nombre,
    u.apellido AS autor_apellido,
    u.foto_perfil AS autor_foto
FROM foro_respuestas fr
JOIN foro_temas ft ON fr.tema_id = ft.id
JOIN usuarios u ON fr.autor_id = u.id;

-- Vista: Notificaciones con detalles de usuario
CREATE OR REPLACE VIEW vista_notificaciones_detalle AS
SELECT
    n.id,
    n.tipo,
    n.titulo,
    n.mensaje,
    n.url_destino,
    n.leida,
    n.created_at,
    u.id AS usuario_id,
    u.nombre AS usuario_nombre,
    u.apellido AS usuario_apellido,
    u.email AS usuario_email
FROM notificaciones n
JOIN usuarios u ON n.usuario_id = u.id;

-- ============================================================================
-- FUNCIONES ÚTILES
-- ============================================================================

-- Función para obtener el progreso de un alumno en un curso
CREATE OR REPLACE FUNCTION obtener_progreso_curso(p_alumno_id UUID, p_curso_id UUID)
RETURNS INTEGER AS $$
DECLARE
    v_progreso INTEGER;
BEGIN
    SELECT progreso_porcentaje INTO v_progreso
    FROM inscripciones
    WHERE alumno_id = p_alumno_id AND curso_id = p_curso_id;
    
    RETURN COALESCE(v_progreso, 0);
END;
$$ LANGUAGE plpgsql;

-- Función para verificar si un alumno está inscrito en un curso
CREATE OR REPLACE FUNCTION alumno_inscrito_en_curso(p_alumno_id UUID, p_curso_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_count
    FROM inscripciones
    WHERE alumno_id = p_alumno_id AND curso_id = p_curso_id;
    
    RETURN v_count > 0;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener el número de intentos de quiz de un alumno
CREATE OR REPLACE FUNCTION obtener_intentos_quiz(p_alumno_id UUID, p_quiz_id UUID)
RETURNS INTEGER AS $$
DECLARE
    v_intentos INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_intentos
    FROM quiz_intentos
    WHERE alumno_id = p_alumno_id AND quiz_id = p_quiz_id;
    
    RETURN v_intentos;
END;
$$ LANGUAGE plpgsql;

-- Función para verificar si un alumno puede intentar un quiz
CREATE OR REPLACE FUNCTION puede_intentar_quiz(p_alumno_id UUID, p_quiz_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    v_intentos_actuales INTEGER;
    v_intentos_maximos INTEGER;
BEGIN
    SELECT intentos_maximos INTO v_intentos_maximos
    FROM quizzes
    WHERE id = p_quiz_id;
    
    SELECT obtener_intentos_quiz(p_alumno_id, p_quiz_id) INTO v_intentos_actuales;
    
    RETURN v_intentos_actuales < v_intentos_maximos;
END;
$$ LANGUAGE plpgsql;

-- Función para actualizar progreso de inscripción basado en clases completadas
CREATE OR REPLACE FUNCTION actualizar_progreso_inscripcion(p_inscripcion_id UUID)
RETURNS VOID AS $$
DECLARE
    v_total_clases INTEGER;
    v_clases_completadas INTEGER;
    v_progreso INTEGER;
BEGIN
    -- Esta función requeriría una tabla de progreso de clases por alumno
    -- Se deja como placeholder para implementación futura
    NULL;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGERS ADICIONALES
-- ============================================================================

-- Trigger para validar que el profesor_id en cursos tenga rol 'profesor'
CREATE OR REPLACE FUNCTION validar_profesor_en_curso()
RETURNS TRIGGER AS $$
DECLARE
    v_rol_nombre VARCHAR(50);
BEGIN
    SELECT r.nombre INTO v_rol_nombre
    FROM usuarios u
    JOIN roles r ON u.rol_id = r.id
    WHERE u.id = NEW.profesor_id;
    
    IF v_rol_nombre != 'profesor' THEN
        RAISE EXCEPTION 'El usuario asignado como profesor debe tener el rol "profesor"';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validar_profesor_en_curso
    BEFORE INSERT OR UPDATE ON cursos
    FOR EACH ROW
    EXECUTE FUNCTION validar_profesor_en_curso();

-- Trigger para validar que el alumno_id en inscripciones tenga rol 'alumno'
CREATE OR REPLACE FUNCTION validar_alumno_en_inscripcion()
RETURNS TRIGGER AS $$
DECLARE
    v_rol_nombre VARCHAR(50);
BEGIN
    SELECT r.nombre INTO v_rol_nombre
    FROM usuarios u
    JOIN roles r ON u.rol_id = r.id
    WHERE u.id = NEW.alumno_id;
    
    IF v_rol_nombre != 'alumno' THEN
        RAISE EXCEPTION 'El usuario inscrito debe tener el rol "alumno"';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validar_alumno_en_inscripcion
    BEFORE INSERT OR UPDATE ON inscripciones
    FOR EACH ROW
    EXECUTE FUNCTION validar_alumno_en_inscripcion();

-- Trigger para validar que el alumno_id en pagos tenga rol 'alumno'
CREATE OR REPLACE FUNCTION validar_alumno_en_pago()
RETURNS TRIGGER AS $$
DECLARE
    v_rol_nombre VARCHAR(50);
BEGIN
    IF NEW.alumno_id IS NOT NULL THEN
        SELECT r.nombre INTO v_rol_nombre
        FROM usuarios u
        JOIN roles r ON u.rol_id = r.id
        WHERE u.id = NEW.alumno_id;
        
        IF v_rol_nombre != 'alumno' THEN
            RAISE EXCEPTION 'El usuario que paga debe tener el rol "alumno"';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validar_alumno_en_pago
    BEFORE INSERT OR UPDATE ON pagos
    FOR EACH ROW
    EXECUTE FUNCTION validar_alumno_en_pago();

-- Trigger para validar que el aprobador en pagos tenga rol 'admin' o 'superadmin'
CREATE OR REPLACE FUNCTION validar_aprobador_pago()
RETURNS TRIGGER AS $$
DECLARE
    v_rol_nombre VARCHAR(50);
BEGIN
    IF NEW.aprobado_por IS NOT NULL THEN
        SELECT r.nombre INTO v_rol_nombre
        FROM usuarios u
        JOIN roles r ON u.rol_id = r.id
        WHERE u.id = NEW.aprobado_por;
        
        IF v_rol_nombre NOT IN ('admin', 'superadmin') THEN
            RAISE EXCEPTION 'El aprobador debe tener rol "admin" o "superadmin"';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validar_aprobador_pago
    BEFORE INSERT OR UPDATE ON pagos
    FOR EACH ROW
    EXECUTE FUNCTION validar_aprobador_pago();

-- Trigger para validar que el alumno_id en entregas tenga rol 'alumno'
CREATE OR REPLACE FUNCTION validar_alumno_en_entrega()
RETURNS TRIGGER AS $$
DECLARE
    v_rol_nombre VARCHAR(50);
BEGIN
    SELECT r.nombre INTO v_rol_nombre
    FROM usuarios u
    JOIN roles r ON u.rol_id = r.id
    WHERE u.id = NEW.alumno_id;
    
    IF v_rol_nombre != 'alumno' THEN
        RAISE EXCEPTION 'El usuario que entrega debe tener el rol "alumno"';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validar_alumno_en_entrega
    BEFORE INSERT OR UPDATE ON entregas
    FOR EACH ROW
    EXECUTE FUNCTION validar_alumno_en_entrega();

-- Trigger para validar que el alumno_id en quiz_intentos tenga rol 'alumno'
CREATE OR REPLACE FUNCTION validar_alumno_en_quiz_intento()
RETURNS TRIGGER AS $$
DECLARE
    v_rol_nombre VARCHAR(50);
BEGIN
    SELECT r.nombre INTO v_rol_nombre
    FROM usuarios u
    JOIN roles r ON u.rol_id = r.id
    WHERE u.id = NEW.alumno_id;
    
    IF v_rol_nombre != 'alumno' THEN
        RAISE EXCEPTION 'El usuario que intenta el quiz debe tener el rol "alumno"';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validar_alumno_en_quiz_intento
    BEFORE INSERT OR UPDATE ON quiz_intentos
    FOR EACH ROW
    EXECUTE FUNCTION validar_alumno_en_quiz_intento();

-- Trigger para validar que el autor en foro_temas sea participante del curso
CREATE OR REPLACE FUNCTION validar_autor_foro_tema()
RETURNS TRIGGER AS $$
DECLARE
    v_inscrito BOOLEAN;
    v_es_profesor BOOLEAN;
BEGIN
    -- Verificar si es el profesor del curso
    SELECT EXISTS(
        SELECT 1 FROM cursos WHERE id = NEW.curso_id AND profesor_id = NEW.autor_id
    ) INTO v_es_profesor;
    
    -- Verificar si está inscrito
    SELECT EXISTS(
        SELECT 1 FROM inscripciones WHERE alumno_id = NEW.autor_id AND curso_id = NEW.curso_id
    ) INTO v_inscrito;
    
    IF NOT v_es_profesor AND NOT v_inscrito THEN
        RAISE EXCEPTION 'El autor del tema debe ser el profesor del curso o un alumno inscrito';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validar_autor_foro_tema
    BEFORE INSERT OR UPDATE ON foro_temas
    FOR EACH ROW
    EXECUTE FUNCTION validar_autor_foro_tema();

-- Trigger para validar que el autor en foro_respuestas sea participante del curso
CREATE OR REPLACE FUNCTION validar_autor_foro_respuesta()
RETURNS TRIGGER AS $$
DECLARE
    v_curso_id UUID;
    v_inscrito BOOLEAN;
    v_es_profesor BOOLEAN;
BEGIN
    SELECT curso_id INTO v_curso_id FROM foro_temas WHERE id = NEW.tema_id;
    
    SELECT EXISTS(
        SELECT 1 FROM cursos WHERE id = v_curso_id AND profesor_id = NEW.autor_id
    ) INTO v_es_profesor;
    
    SELECT EXISTS(
        SELECT 1 FROM inscripciones WHERE alumno_id = NEW.autor_id AND curso_id = v_curso_id
    ) INTO v_inscrito;
    
    IF NOT v_es_profesor AND NOT v_inscrito THEN
        RAISE EXCEPTION 'El autor de la respuesta debe ser el profesor del curso o un alumno inscrito';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validar_autor_foro_respuesta
    BEFORE INSERT OR UPDATE ON foro_respuestas
    FOR EACH ROW
    EXECUTE FUNCTION validar_autor_foro_respuesta();

-- ============================================================================
-- POLÍTICAS DE SEGURIDAD (RLS - Row Level Security)
-- ============================================================================

-- Habilitar RLS en tablas sensibles
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE perfiles_profesor ENABLE ROW LEVEL SECURITY;
ALTER TABLE inscripciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagos ENABLE ROW LEVEL SECURITY;
ALTER TABLE entregas ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_intentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensajes ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificaciones ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios solo ven su propio perfil
CREATE POLICY usuarios_own_profile ON usuarios
    FOR SELECT USING (id = current_user_id());

-- Política: Los admins ven todos los usuarios
CREATE POLICY usuarios_admin_all ON usuarios
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM usuarios u
            JOIN roles r ON u.rol_id = r.id
            WHERE u.id = current_user_id() AND r.nombre IN ('admin', 'superadmin')
        )
    );

-- Política: Los profesores ven sus alumnos inscritos
CREATE POLICY usuarios_profesor_alumnos ON usuarios
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM inscripciones i
            JOIN cursos c ON i.curso_id = c.id
            WHERE i.alumno_id = usuarios.id AND c.profesor_id = current_user_id()
        )
    );

-- Función helper para obtener el ID del usuario actual (placeholder para auth real)
CREATE OR REPLACE FUNCTION current_user_id()
RETURNS UUID AS $$
BEGIN
    -- En producción, esto vendría del contexto de autenticación (ej. Supabase auth.uid())
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- COMENTARIOS EN TABLAS Y COLUMNAS
-- ============================================================================

COMMENT ON TABLE roles IS 'Roles del sistema: superadmin, admin, profesor, alumno';
COMMENT ON TABLE usuarios IS 'Usuarios de la plataforma (alumnos, profesores, admins)';
COMMENT ON TABLE perfiles_profesor IS 'Perfiles extendidos para usuarios con rol profesor';
COMMENT ON TABLE cursos IS 'Cursos ofrecidos en la plataforma';
COMMENT ON TABLE semanas IS 'Semanas/módulos dentro de un curso';
COMMENT ON TABLE clases IS 'Clases/lecciones dentro de una semana';
COMMENT ON TABLE materiales IS 'Materiales de apoyo para cada clase (PDFs, videos, enlaces)';
COMMENT ON TABLE inscripciones IS 'Inscripciones de alumnos a cursos';
COMMENT ON TABLE pagos IS 'Pagos realizados por inscripciones';
COMMENT ON TABLE tareas IS 'Tareas asignadas en los cursos';
COMMENT ON TABLE entregas IS 'Entregas de tareas por parte de los alumnos';
COMMENT ON TABLE quizzes IS 'Quizzes/evaluaciones en los cursos';
COMMENT ON TABLE quiz_preguntas IS 'Preguntas de cada quiz';
COMMENT ON TABLE quiz_intentos IS 'Intentos de quiz por parte de los alumnos';
COMMENT ON TABLE conversaciones IS 'Conversaciones de chat (privadas o grupales por curso)';
COMMENT ON TABLE conversacion_participantes IS 'Participantes de cada conversación';
COMMENT ON TABLE mensajes IS 'Mensajes dentro de las conversaciones';
COMMENT ON TABLE foro_temas IS 'Temas de discusión en foros por curso/semana';
COMMENT ON TABLE foro_respuestas IS 'Respuestas a los temas del foro';
COMMENT ON TABLE notificaciones IS 'Notificaciones para los usuarios';

COMMENT ON COLUMN usuarios.codigo_alumno IS 'Código único de identificación del alumno';
COMMENT ON COLUMN usuarios.primer_login IS 'Indica si es el primer acceso (para forzar cambio de contraseña)';
COMMENT ON COLUMN cursos.slug IS 'Identificador único legible para URLs';
COMMENT ON COLUMN cursos.nivel IS 'Nivel de dificultad: principiante, intermedio, avanzado';
COMMENT ON TABLE pagos.metodo_pago IS 'Método de pago: yape, plin, transferencia, tarjeta';
COMMENT ON TABLE pagos.estado IS 'Estado del pago: pendiente, aprobado, rechazado, reembolsado';
COMMENT ON TABLE tareas.tipo IS 'Tipo de tarea: individual, grupal';
COMMENT ON TABLE entregas.estado IS 'Estado de la entrega: entregado, calificado, devuelto, reenviado';
COMMENT ON TABLE quiz_preguntas.tipo IS 'Tipo de pregunta: opcion_multiple, verdadero_falso, respuesta_corta';
COMMENT ON TABLE conversaciones.tipo IS 'Tipo de conversación: privada, grupal, curso';
COMMENT ON TABLE notificaciones.tipo IS 'Tipo de notificación: tarea_nueva, calificacion, mensaje, pago, sistema';

-- ============================================================================
-- FIN DEL SCRIPT
-- ============================================================================