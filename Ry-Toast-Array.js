define(["jquery", "qlik", "css!./style.css"], function ($, qlik, bootstrapCss) {
'use strict';

  return {
    initialProperties: {
      qHyperCubeDef: {
        qDimensions: [],
        qMeasures: [],
        qInitialDataFetch: [{ qWidth: 2, qHeight: 1 }]
      },
      toastItems: []
    },

    definition: {
      type: "items",
      component: "accordion",
      items: {
        settings: {
          uses: "settings",
          items: {
            toastArray: {
              type: "array",
              ref: "toastItems",
              label: "Configuración del toast",
              itemTitleRef: "toastName",
              allowAdd: true,
              allowRemove: true,
              addTranslation: "Agregar toast",
              items: {
			    toastName: {
				 type: "string",
				 label: "Nombre del Toast",
				 ref: "toastName"
				},
                targetKpiId: {
                  type: "string",
                  label: "ID del objeto objetivo",
                  ref: "targetKpiId"
                },
                toastContent: {
                  type: "string",
                  label: "Contenido del Toast",
                  ref: "toastContent",
				  defaultValue: "= " +
				  				"'Hola, soy un toast!' & chr(10) & " +
								"'Este componente te ayudará a que manejes información relevante.' & repeat(chr(10),2) & " +
								"'Puedes integrar fórmulas, texto y código html estilizado con el apoyo de un MultiKPI.' & repeat(chr(10),2) & " +
								"'Soy un componente poderoso creado por el equipo de <b>IE @ Grupo Reyma - 2025.</b>' & chr(10) & " +
								"repeat('=',80)",
				  expression: "always"
                },
				backgroundColor: {
				  type: "string",							
				  ref: "backgroundColor",
				  label: "🎨 Color de fondo",
				  defaultValue: "rgba(0,0,0,0.85)",
				  help: "Usa valores como: rgba(0,0,0,0.85), #2ecc71, ect"
				},
				fontColor: {
				  type: "string",							
				  ref: "fontColor",
				  label: "🖋️ Color del texto",
				  defaultValue: "#ffffff",				  
				  help: "Usa valores como: #fff, #000, red, etc."
				},
                delay: {
                  type: "integer",
                  label: "Retardo (ms)",
                  ref: "delay",
                  defaultValue: 300
                },
                duration: {
                  type: "integer",
                  label: "Duración (ms) - Setea en 0 para omitir la duración",
                  ref: "duration",
                  defaultValue: 3000
                },
                position: {
                  type: "string",
                  label: "Posición",
                  ref: "position",
                  component: "dropdown",
                  options: [
                    { value: "fixed-bottom", label: "Tipo Notificación" },
                    { value: "target", label: "Alineado con el target" }
                  ],
                  defaultValue: "fixed-bottom"
                }
              }
            }
          }
        }
      }
    },

    paint: function($element, layout) {
      $element.empty().off();
      // Eliminar todos los toasts anteriores
      $('.qlik-toast[data-extension-id="'+layout.qInfo.qId+'"]').remove();

	  const closeAllToasts = () => {
		$('.qlik-toast.toast-visible').removeClass('toast-visible').fadeOut(200);
	  };
	 
      const attachToast = (config, index) => {
        const toastId = `toast-${layout.qInfo.qId}-${index}`;
		
		const bgColor = (typeof config.backgroundColor === 'string' ? config.backgroundColor : 'rgba(0,0,0,0.85)').replace(/['"]/g, '');
        const fontColor = (typeof config.fontColor === 'string' ? config.fontColor : '#ffffff').replace(/['"]/g, '');		
        const $toast = $(`
          <div id="${toastId}" class="qlik-toast shadow-sm" data-extension-id="${layout.qInfo.qId}"
               style="display:none; background-color: ${bgColor}; color: ${fontColor};">            
            <div class="toast-body">${config.toastContent || ""}</div>
          </div>
        `);
		
		$("body").append($toast);

        const findTarget = () => {
          try {
            let $target = $(`[data-qvid="${config.targetKpiId}"]`);
            if ($target.length) return $target;

            $target = $(`[data-id="${config.targetKpiId}"]`);
            if ($target.length) return $target;

            const escapedId = config.targetKpiId.replace(/([:.\\[\\]()])/g, '\\$1');
            return $(`#${escapedId}`);
          } catch (e) {
            console.error("Error en selector:", e);
            return $();
          }
        };

		const positionToast = ($target) => {
		  switch(config.position) {
		  	case "target":
				const rect = $target[0].getBoundingClientRect();
				const base = {
					top: rect.top + window.scrollY,
					left: rect.left + window.scrollX
				  };

				return {
					top: base.top + ($target.outerHeight() / 2) - ($toast.outerHeight() / 2),
					left: base.left + $target.outerWidth() + 10
				};
		  	case "fixed-bottom":
			default:
				return {
				   position: "fixed",
			  	   bottom: "20px",
			  	   right: "20px",
			       transform: "translateX(0%)"
				};
		 }
		};

        const connectEvents = () => {
          const $target = findTarget();
          if (!$target.length) {
            console.warn("Target no encontrado:", config.targetKpiId);
            return false;
          }

          // Desvincular eventos anteriores
          $target.off('.toast-' + index);

          let toastTimeout;
          const showToast = () => {
            clearTimeout(toastTimeout);
            toastTimeout = setTimeout(() => {
			  closeAllToasts();
              const pos = positionToast($target);
              $toast.css(pos).addClass('toast-visible').fadeIn(200);

              if (config.duration > 0) {
                setTimeout(() => {
                  $toast.removeClass('toast-visible').fadeOut(200);
                }, config.duration);
              }
            }, config.delay || 0);
          };

          const hideToast = () => {
            clearTimeout(toastTimeout);
            $toast.removeClass('toast-visible').fadeOut(200);
          };

          $target
            .on('click.toast-' + index, showToast)
            .on('mouseenter.toast-' + index, hideToast);

          $element.on('qv-destroy', () => {
            $target.off('.toast-' + index);
            $toast.remove();
          });

          return true;
        };

        // Conectar inmediatamente y observar cambios
        if (!connectEvents()) {
          const retryInterval = setInterval(() => {
            if (connectEvents()) clearInterval(retryInterval);
          }, 500);
          setTimeout(() => clearInterval(retryInterval), 10000);
        }

        const observer = new MutationObserver(() => {
          connectEvents();
        });
        observer.observe(document.body, { childList: true, subtree: true });
      };

      // Crear todos los toasts configurados
      (layout.toastItems || []).forEach((item, index) => {
        if (item.targetKpiId && item.toastContent) {
          attachToast(item, index);
        }
      });

      return qlik.Promise.resolve();
    }
  };
});
