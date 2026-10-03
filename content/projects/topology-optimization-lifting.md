**Overview.** The transportation of a diverse product range-specifically pumps of different sizes and weights-creates logistical bottlenecks due to frequent tool changes. This project investigates the design of a generalized conveyor attachment system capable of handling diverse loads without operational stoppages.

**Methodology.** The study utilizes topology optimization to analyze the structural balance between stress and material consumption. By applying Finite Element Method (FEM) stress analysis in Ansys Mechanical, the design process iteratively removes material from determining where structural support is essential vs. where it is negligible.

**Mathematical Validation.** To validate the FEA results, a simplification of the attachment solution was performed using hand calculations based on the Winkler-Bach formula for bending of curved beams. The hook is affected by both direct tensile stress and bending stress:

$$
\sigma = \frac{F}{A} + M \cdot \frac{r_n - r_i}{A \cdot e \cdot r_i}
$$

Where $r_n$ is the neutral axis radius ($r_n = \frac{h}{\ln(r_o/r_i)}$) and $e$ is the eccentricity. The theoretical deflection was calculated as:

$$
\delta = \frac{\pi \cdot F \cdot R^2}{2 \cdot E \cdot A \cdot e}
$$

**Optimization Results.** Three distinct models were generated based on different load cases (400 N and 1500 N) and contact surfaces. The results demonstrated a non-linear trade-off between volume and stress, visualized as a Pareto front.

| Model | Load Case | Volume [L] | Max Stress [MPa] | Characteristics |
| :--- | :--- | :--- | :--- | :--- |
| **Model 1** | 400 N | 1.35 | 10.89 | **Balanced:** Good trade-off between weight and strength. |
| **Model 2** | 1500 N | 1.48 | 10.46 | **Lowest Stress:** Most durable, but highest volume. |
| **Model 3** | 1500 N (Small Area) | 1.19 | 13.29 | **Lowest Volume:** Lightest design (48% reduction), higher stress. |

**Conclusion.** The final optimized solution achieved a weight reduction of up to 48% compared to the original design while maintaining structural integrity under a reference load of 3000 N. The study confirmed that while critical stress areas require consistent material distribution across load cases, the magnitude of material volume can be optimized significantly.
