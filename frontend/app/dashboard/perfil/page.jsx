'use client'

import { useRouter } from 'next/navigation'
import { useProfile } from '../../../lib/user/useProfile'

export default function PerfilPage() {
  const router = useRouter()
  const {
    user,
    infoForm,
    setInfoForm,
    infoStatus,
    pwForm,
    setPwForm,
    pwStatus,
    deleteConfirm,
    setDeleteConfirm,
    deleteStatus,
    handleInfoSave,
    handlePasswordChange,
    handleDeleteAccount,
  } = useProfile()

  if (!user) {
    return (
      <div className="perfil-loading">
        <span>Cargando perfil…</span>
      </div>
    )
  }

  const initials = (user.name?.[0] ?? user.email?.[0] ?? 'U').toUpperCase()

  return (
    <div className="perfil-page">
      <h1 className="perfil-title">Mi perfil</h1>

      {/* Avatar + nombre */}
      <div className="profile-header">
        <div className="profile-avatar-lg">{initials}</div>
        <div>
          <p className="profile-name">{user.name || 'Sin nombre'}</p>
          <p className="profile-email-meta">{user.email}</p>
        </div>
      </div>

      {/* Sección 1: Información personal */}
      <section className="paper profile-section">
        <h3>Información personal</h3>

        <label>
          Nombre
          <input
            type="text"
            value={infoForm.name}
            onChange={(e) => setInfoForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Tu nombre completo"
          />
        </label>

        <label>
          Correo electrónico
          <input
            type="email"
            value={infoForm.email}
            onChange={(e) => setInfoForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="tu@correo.com"
          />
        </label>

        {infoStatus.error && <p className="error-msg">{infoStatus.error}</p>}
        {infoStatus.success && <p className="success-msg">✓ Cambios guardados correctamente</p>}

        <button
          className="btn-primary"
          onClick={handleInfoSave}
          disabled={infoStatus.loading}
        >
          {infoStatus.loading ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </section>

      {/* Sección 2: Seguridad */}
      <section className="paper profile-section">
        <h3>Seguridad</h3>

        {user.provider === 'google' ? (
          <p className="provider-note">
            Tu cuenta está conectada con Google. Gestiona tu contraseña directamente desde tu cuenta de Google.
          </p>
        ) : (
          <>
            <label>
              Contraseña actual
              <input
                type="password"
                value={pwForm.currentPassword}
                onChange={(e) => setPwForm((f) => ({ ...f, currentPassword: e.target.value }))}
                placeholder="Contraseña actual"
                autoComplete="current-password"
              />
            </label>

            <label>
              Nueva contraseña
              <input
                type="password"
                value={pwForm.newPassword}
                onChange={(e) => setPwForm((f) => ({ ...f, newPassword: e.target.value }))}
                placeholder="Mínimo 6 caracteres"
                autoComplete="new-password"
              />
            </label>

            <label>
              Confirmar nueva contraseña
              <input
                type="password"
                value={pwForm.confirmPassword}
                onChange={(e) => setPwForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                placeholder="Repite la nueva contraseña"
                autoComplete="new-password"
              />
            </label>

            {pwStatus.error && <p className="error-msg">{pwStatus.error}</p>}
            {pwStatus.success && <p className="success-msg">✓ Contraseña actualizada correctamente</p>}

            <button
              className="btn-secondary"
              onClick={handlePasswordChange}
              disabled={pwStatus.loading}
            >
              {pwStatus.loading ? 'Actualizando…' : 'Cambiar contraseña'}
            </button>
          </>
        )}
      </section>

      {/* Sección 3: Zona peligrosa */}
      <section className="paper profile-section danger-zone">
        <h3>Zona peligrosa</h3>
        <p className="danger-description">
          Esta acción es permanente e irreversible. Se eliminará tu cuenta, tus datos y no podrás recuperarlos.
        </p>
        <p className="danger-instruction">
          Para confirmar, escribe <strong>ELIMINAR</strong> en el campo de abajo:
        </p>

        <input
          type="text"
          value={deleteConfirm}
          onChange={(e) => setDeleteConfirm(e.target.value)}
          placeholder="ELIMINAR"
          className="delete-confirm-input"
        />

        {deleteStatus.error && <p className="error-msg">{deleteStatus.error}</p>}

        <button
          className="btn-danger"
          onClick={() => handleDeleteAccount(router)}
          disabled={deleteConfirm !== 'ELIMINAR' || deleteStatus.loading}
        >
          {deleteStatus.loading ? 'Eliminando cuenta…' : 'Eliminar mi cuenta'}
        </button>
      </section>
    </div>
  )
}
