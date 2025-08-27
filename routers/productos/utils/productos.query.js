// routers/productos/utils/productos.query.js
module.exports = {
  list: `
    SELECT id, nombre, descripcion, precio, talla, imagen_url, activo
    FROM dbo.Productos
    WHERE (@activo IS NULL OR activo = @activo)
      AND (@q IS NULL OR nombre LIKE '%' + @q + '%')
    ORDER BY id DESC
    OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY;
  `,
  count: `
    SELECT COUNT(*) AS total
    FROM dbo.Productos
    WHERE (@activo IS NULL OR activo = @activo)
      AND (@q IS NULL OR nombre LIKE '%' + @q + '%');
  `,
  getById: `
    SELECT id, nombre, descripcion, precio, talla, imagen_url, activo
    FROM dbo.Productos
    WHERE id = @id;
  `,
  insert: `
    INSERT INTO dbo.Productos (nombre, descripcion, precio, talla, imagen_url, activo)
    VALUES (@nombre, @descripcion, @precio, @talla, @imagen_url, @activo);
    SELECT SCOPE_IDENTITY() AS id;
  `,
  updateById: `
    UPDATE dbo.Productos
    SET nombre = @nombre,
        descripcion = @descripcion,
        precio = @precio,
        talla = @talla,
        imagen_url = @imagen_url,
        activo = @activo
    WHERE id = @id;
    SELECT @@ROWCOUNT AS affected;
  `,
  deleteById: `
    DELETE FROM dbo.Productos WHERE id = @id;
    SELECT @@ROWCOUNT AS affected;
  `,
};
