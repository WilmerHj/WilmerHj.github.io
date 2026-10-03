**Overview.** The problem consists of building up a simulation model for an arrow launched from a compound bow. The objective was to hit a target 20 meters away and estimate how the release affects the accuracy, considering different shooting styles with the Mediterranean draw. The simulation includes surrounding factors such as gravitation, quadratic air resistance, shooting angle, and the archer's paradox.

**Methodology.**
The project combined empirical measurements with advanced numerical methods to simulate the entire launch and flight sequence.

**Experimental Data Collection.** An experiment was conducted using an actual compound bow and a dynamometer. By measuring the force applied to the string for different draw lengths, a nonlinear relationship was interpolated to compute the initial velocity.

**Modeling the Archer's Paradox.** The arrow was simplified into an Euler-Bernoulli beam. The dynamic movement was calculated using the Finite Element Method (FEM) and integrated over time using the Newmark-Beta method. The beam equation used in the model was $EI\,w''''(x,t) + \rho A\,\ddot{w}(x,t) = 0$.

**Flight Trajectory.** The flight path was modeled as an ordinary differential equation (ODE) initial value problem and solved using the fourth-order Runge-Kutta (RK4) method. The model combined initial velocity, gravity, quadratic air resistance, and the tip vibrations derived from the FEM calculations.

**Results.** The simulation produced a periodic oscillating motion reflecting the archer's paradox over a 20-meter trajectory. The impact of different initial conditions on accuracy was evaluated:
* The order and timing of which finger leaves the string first, introducing horizontal and vertical offsets, has the largest impact on hit location.
* An uneven release excites a stronger tip vibration and gives the arrow a persistent initial angular deviation.
* Differences in draw length resulted in considerably lower spread, giving it the least impact on overall precision.

**Conclusion.** To minimize potential error and maximize accuracy, it is highly recommended to release all fingers as simultaneously as possible without pulling the string sideways.
