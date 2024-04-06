# Búsqueda Lineal 

## Resumen
Este repósitorio contiene código para experimentar la aplicación de distintas búsquedas lineales, particularmente Hill Climbing (variante clásica) y Simulated Annealing.
Se pueden probar dos funciones correspondientes a un trabajo práctica de la materia _**Sistemas Inteligentes, del Quinto Año de la Carrera LSI/LCC de la Universidad Nacional del Comahue**_


## Detalles de Implementación y Cómo ejecutarlo

Se realizó con JavaScript y React para el frontend.
Si se desea clonar y probar, seguir las siguientes instrucciones:

Para la instalación de las dependencias, en el directorio del proyecto usar el comando en la terminal:

### `npm install`

Para ejecutarlo, en el directorio del proyecto usar el comando en la terminal:

### `npm start`

Iniciará en la url [http://localhost:3000](http://localhost:3000)

## Detalles a tener en cuenta

* El frontend esta muy verde porque la prioridad era el funcionamiento de la lógica
* Por como funcionan la suma, multiplicación, división, etcs de flotantes, el "paso" más chico de las ecuaciones es de 0.5
* El funcionamiento correcto de Simulated Annealing aún debe ser corroborado
* Falta tratar algunos casos del dominio: Ej: Limite superior == Limite inferior, arrojará un error.

## Futuros (posibles) Milestones

* Hacer un Frontend mas presentable
* Limpiar código
* Ver cómo achicar el paso en las ecuaciones sin obtener resultador numéricos erroneos
* Corregir errores en casos particulares a la hora de ingresar dominio
* Aplicar un parser para que el usuario ingrese su propia función matemática
* Agregar graficos

## Licencia

Se permite el uso y modificación de este código para fines personales y académicos. 
Recordar que fue una implementación que surgió en base a un trabajo académico y no esta exento de fallas, por lo tanto, usarlo con discreción.
