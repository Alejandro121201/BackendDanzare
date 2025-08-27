// routers/eventos/utils/eventos.query.js
module.exports = {
  list: `
    SELECT id, nombre, descripcion, precio, fecha, hora_inicio, hora_fin, imagen_url, activo
    FROM dbo.Eventos
    WHERE (@activo IS NULL OR activo = @activo)
      AND (@q IS NULL OR nombre LIKE '%' + @q + '%')
      AND (@from IS NULL OR fecha >= @from)
      AND (@to   IS NULL OR fecha <= @to)
    ORDER BY fecha DESC, id DESC
    OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY;
  `,
  count: `
    SELECT COUNT(*) AS total
    FROM dbo.Eventos
    WHERE (@activo IS NULL OR activo = @activo)
      AND (@q IS NULL OR nombre LIKE '%' + @q + '%')
      AND (@from IS NULL OR fecha >= @from)
      AND (@to   IS NULL OR fecha <= @to);
  `,
  getById: `
    SELECT id, nombre, descripcion, precio, fecha, hora_inicio, hora_fin, imagen_url, activo
    FROM dbo.Eventos
    WHERE id = @id;
  `,
  insert: `
    INSERT INTO dbo.Eventos (nombre, descripcion, precio, fecha, hora_inicio, hora_fin, imagen_url, activo)
    VALUES (@nombre, @descripcion, @precio, @fecha, @hora_inicio, @hora_fin, @imagen_url, @activo);
    SELECT SCOPE_IDENTITY() AS id;
  `,
  updateById: `
    UPDATE dbo.Eventos SET
      nombre = @nombre,
      descripcion = @descripcion,
      precio = @precio,
      fecha = @fecha,
      hora_inicio = @hora_inicio,
      hora_fin = @hora_fin,
      imagen_url = @imagen_url,
      activo = @activo
    WHERE id = @id;
    SELECT @@ROWCOUNT AS affected;
  `,
  deleteById: `
    DELETE FROM dbo.Eventos WHERE id = @id;
    SELECT @@ROWCOUNT AS affected;
  `,
};
