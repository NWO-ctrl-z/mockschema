// 1. Seleccion de los elementos html
const inputSql = document.getElementById('sql-input');
const inputRegistros = document.getElementById('num-records');
const btnGenerar = document.getElementById('generate-btn');
const outputSql = document.getElementById('sql-output');
const btnDescargar = document.getElementById('download-btn');
const selectIdioma = document.getElementById('language-select'); // <-- NUEVA LÍNEA DEL MENÚ


//  Motor logico 1: el parser
function analizarSQL(codigoSql) {
    const tablasEncontradas = [];
    const fragmentos = codigoSql.split(/CREATE TABLE/i);

    for (let i = 1; i < fragmentos.length; i++) {
        const fragmento = fragmentos[i];
        
        const indicePrimerParentesis = fragmento.indexOf('(');
        const nombreTabla = fragmento.substring(0, indicePrimerParentesis).trim();

        const indiceUltimoParentesis = fragmento.lastIndexOf(')');
        const textoColumnas = fragmento.substring(indicePrimerParentesis + 1, indiceUltimoParentesis);

        const lineasColumnas = textoColumnas.split(',');
        const columnasLimpas = [];

        for (let linea of lineasColumnas) {
            linea = linea.trim(); 
            
            if (linea === '' || linea.toUpperCase().startsWith('PRIMARY KEY') || linea.toUpperCase().startsWith('FOREIGN KEY')) {
                continue;
            }

            const partes = linea.split(/\s+/);
            const nombreColumna = partes[0]; 

            columnasLimpas.push(nombreColumna);
        }

        tablasEncontradas.push({
            tabla: nombreTabla,
            columnas: columnasLimpas
        });
    }

    return tablasEncontradas; 
}


//  Motor logico 2: generador de datos
function generarSentenciasInsert(estructura, cantidad) {
    let sqlFinal = '';

    for (const tablaInfo of estructura) {
        const nombreTabla = tablaInfo.tabla;
        const columnas = tablaInfo.columnas;

        sqlFinal += `-- Datos autogenerados para la tabla: ${nombreTabla}\n`;

        for (let i = 0; i < cantidad; i++) {
            const valoresFalsos = [];

            for (const columna of columnas) {
                const nombreCol = columna.toLowerCase();
                let datoGenerado;

                // Se verifica qué idioma eligió el usuario en el menú
                const fakerActivo = selectIdioma.value === 'es' ? window.fakerES : window.fakerEN;

                // 1. Llave primaria
                if (nombreCol === 'id' || nombreCol.startsWith('id_')) {
                    datoGenerado = i + 1; 
                } 
                // 2. Llave foránea 
                else if (nombreCol.endsWith('_id')) {
                    datoGenerado = Math.floor(Math.random() * cantidad) + 1;
                } 
                // 3. Generación de datos usando el idioma activo
                else if (nombreCol.includes('nombre')) {
                    datoGenerado = `'${fakerActivo.person.fullName().replace(/'/g, "''")}'`; 
                } else if (nombreCol.includes('correo') || nombreCol.includes('email')) {
                    datoGenerado = `'${fakerActivo.internet.email()}'`;
                } else if (nombreCol.includes('fecha')) {
                    const fechaObj = fakerActivo.date.past();
                    const fechaTexto = fechaObj.toISOString().split('T')[0]; 
                    datoGenerado = `'${fechaTexto}'`;
                } else {
                    datoGenerado = `'${fakerActivo.lorem.word()}'`; 
                }

                valoresFalsos.push(datoGenerado);
            }

            const columnasUnidas = columnas.join(', ');
            const valoresUnidos = valoresFalsos.join(', ');
            sqlFinal += `INSERT INTO ${nombreTabla} (${columnasUnidas}) VALUES (${valoresUnidos});\n`;
        }
        
        sqlFinal += '\n'; 
    }

    return sqlFinal;
}


//  2 y 3 integracion final y limite de seguridad
btnGenerar.addEventListener('click', () => {
    const codigoSql = inputSql.value;
    let cantidad = parseInt(inputRegistros.value);

    // Límite de seguridad
    if (cantidad > 5000) {
        alert('Para evitar que el navegador se congele, el límite máximo es de 5000 registros por tabla.');
        cantidad = 5000;
        inputRegistros.value = 5000;
    }

    if (codigoSql.trim() === '') {
        alert('Por favor, pega tu código SQL primero.');
        return; 
    }

    const estructuraBaseDatos = analizarSQL(codigoSql);
    const resultadoSQL = generarSentenciasInsert(estructuraBaseDatos, cantidad);

    outputSql.value = resultadoSQL;
    btnDescargar.disabled = false;
});


//  4. boton de descargar 
btnDescargar.addEventListener('click', () => {
    const contenido = outputSql.value;
    const archivoBlob = new Blob([contenido], { type: 'text/plain' });
    const url = URL.createObjectURL(archivoBlob);
    const enlaceOculto = document.createElement('a');
    enlaceOculto.href = url;
    enlaceOculto.download = 'mockschema_datos.sql'; 
    enlaceOculto.click();
    URL.revokeObjectURL(url);
});
