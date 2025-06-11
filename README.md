# Ry-Toast-Array para Qlik Sense

**Versión:** 2.0.0  
**Autor:** Daniel Rodríguez – IE Team @ Grupo Reyma  
**Repositorio:** [GitHub - Ry-Toast-Array](https://github.com/tu_usuario/Ry-Toast-Array)

---

## 📌 Descripción

`Ry-Toast-Array` es un componente de extensión para Qlik Sense que permite asociar **notificaciones tipo “toast”** a objetos visuales, principalmente KPIs, pero también otros elementos de la hoja. Ideal para mostrar información contextual, alertas, sugerencias o mensajes personalizados al usuario final.

![Preview](preview-toast.png)

---

## 🎯 Funcionalidades principales

- 🎯 **Multiples toasts** configurables de forma independiente.
- 🎨 **Personalización total** de colores (fondo y texto).
- ⏱️ Control de **duración**, **retardo** y **posición**.
- 🧠 Soporte para **expresiones Qlik** (`=...`) y **HTML** enriquecido.
- ⚡ **Carga inmediata**, incluso si el target aún no está renderizado.
- 🔄 **Auto-observador**: reconecta si el target cambia dinámicamente.
- 🚫 **No bloquea la hoja ni ocupa espacio visual** (modo invisible).
- 🧩 Integración fluida como parte del dashboard UX.

---

## ⚙️ Parámetros configurables

| Propiedad         | Descripción                                                  | Valor por defecto          |
|-------------------|--------------------------------------------------------------|----------------------------|
| `toastName`       | Nombre para identificar el toast                             | (vacío)                    |
| `targetKpiId`     | ID del objeto objetivo (ej. `KPI01`)                         | (vacío)                    |
| `toastContent`    | Contenido HTML o fórmula Qlik                                | Texto informativo básico   |
| `backgroundColor` | Color de fondo del toast                                     | `rgba(0,0,0,0.85)`         |
| `fontColor`       | Color del texto                                              | `#ffffff`                  |
| `delay`           | Tiempo antes de mostrarse (en ms)                            | `300`                      |
| `duration`        | Tiempo visible (en ms). Usa `0` para que sea permanente      | `3000`                     |
| `position`        | Posición respecto al objeto: `top`, `bottom`, `left`, `right`, `target` | `bottom`          |

---

## 🧩 Instalación

1. Descarga el repositorio desde GitHub o ZIP.
2. Copia la carpeta `Ry-Toast-Array` a tu carpeta de extensiones de Qlik Sense:
    ```C:\Users<tu_usuario>\Documents\Qlik\Sense\Extensions\```

3. Reinicia Qlik Sense Desktop o recarga el hub en Enterprise.
4. Desde el panel de **Visualizaciones personalizadas**, arrastra el componente a tu hoja.
5. Configura los toasts deseados desde el panel derecho.

---

## 🧩 Compatibilidad

- Qlik Sense Desktop y Enterprise
- Probado en versión September 2023 y posteriores
- Compatible con temas personalizados

---

## 💡 Ejemplo de contenido con HTML y expresión

```qlik
= '⚠️ Departamentos con tickets:' & chr(10) &
'<ul>' &
concat(
aggr(
 if(count({<estatus_ticket={'EN PROCESO'}>} departamento_asignado),
   '<li>' & departamento_asignado & '</li>'
 )
, departamento_asignado),
chr(10)) &
'</ul>'
```

---

## 📜 Licencia

Este proyecto está licenciado bajo los términos de la licencia [MIT](LICENSE).

