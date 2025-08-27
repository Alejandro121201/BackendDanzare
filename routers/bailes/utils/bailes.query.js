// routers/bailes/utils/bailes.query.js
module.exports = {
  list: `
    SELECT id, nombre, descripcion, precio, edad_minima, imagen_url, activo
    FROM dbo.Bailes
    WHERE (@activo IS NULL OR activo = @activo)
      AND (@q IS NULL OR nombre LIKE '%' + @q + '%')
    ORDER BY id DESC
    OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY;
  `,
  count: `
    SELECT COUNT(*) AS total
    FROM dbo.Bailes
    WHERE (@activo IS NULL OR activo = @activo)
      AND (@q IS NULL OR nombre LIKE '%' + @q + '%');
  `,
  getById: `
    SELECT id, nombre, descripcion, precio, edad_minima, imagen_url, activo
    FROM dbo.Bailes
    WHERE id = @id;
  `,
  insert: `
    INSERT INTO dbo.Bailes (nombre, descripcion, precio, edad_minima, imagen_url, activo)
    VALUES (@nombre, @descripcion, @precio, @edad_minima, @imagen_url, @activo);
    SELECT SCOPE_IDENTITY() AS id;
  `,
  updateById: `
    UPDATE dbo.Bailes
    SET nombre = @nombre,
        descripcion = @descripcion,
        precio = @precio,
        edad_minima = @edad_minima,
        imagen_url = @imagen_url,
        activo = @activo
    WHERE id = @id;
    SELECT @@ROWCOUNT AS affected;
  `,
  deleteById: `
    DELETE FROM dbo.Bailes WHERE id = @id;
    SELECT @@ROWCOUNT AS affected;
  `,
};
