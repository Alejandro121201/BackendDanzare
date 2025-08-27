// routers/usuarios/utils/usuarios.query.js
module.exports = {
  upsertFromGoogle: `
    MERGE dbo.Usuarios AS target
    USING (SELECT @google_id AS google_id) AS src
      ON (target.google_id = src.google_id)
    WHEN MATCHED THEN
      UPDATE SET
        email = @email,
        nombre_completo = @nombre_completo,
        nombre = @nombre,
        apellido = @apellido,
        foto_url = @foto_url,
        idioma = @idioma,
        ultimo_login = GETDATE()
    WHEN NOT MATCHED THEN
      INSERT (google_id, email, nombre_completo, nombre, apellido, foto_url, idioma, rol, fecha_registro, ultimo_login)
      VALUES (@google_id, @email, @nombre_completo, @nombre, @apellido, @foto_url, @idioma, DEFAULT, GETDATE(), GETDATE())
    OUTPUT inserted.id;
  `,

  getById: `
    SELECT id, google_id, email, nombre_completo, nombre, apellido, foto_url, idioma, rol, fecha_registro, ultimo_login
    FROM dbo.Usuarios
    WHERE id = @id;
  `,
};
