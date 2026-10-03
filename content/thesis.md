*Link to thesis PDF:* [Guidelines for Resource Efficient Finite Element Analysis of Bolted Joints under Random Vibration Fatigue](http://www.diva-portal.org/smash/record.jsf?pid=diva2:2067092)
> *A practical engineering model is not the most detailed model available, but the simplest model that still answers the right question with sufficient confidence.*

**Background.** Predicting random-vibration fatigue in bolted joints is challenging. While industry standards provide analytical frameworks, they lack systematic guidance on selecting a Finite Element bolt representation. Fully threaded 3D models become prohibitive at large assembly scale, requiring engineers to simplify - yet it remains unclear *when* specific simplifications are acceptable.

**Objective.** Develop practical guidelines for selecting bolt modeling strategies in random vibration fatigue analysis, balancing accuracy against computational cost. The work tests the hypothesis that model selection can be systematized based on the mechanical phenomena of interest and the requirements on accuracy and cost.

**Method.** The study combines a qualitative literature review with a comparative computational experiment. Four FE representations of a single-bolt joint were analyzed:

* **Bonded surface** contact
* **1D beam** element
* **CBUSH spring** connector
* **Threadless 3D solid** (reference)

Each model was subjected to pre-stressed linear perturbation (modal + random response) with two excitation profiles - **NASA-STD-7001B** and **MIL-STD-810G T43A** - in both transverse and axial directions. The stress tensor PSDs were reduced to an equivalent von Mises PSD using the **Segalman method**, mean stress from bolt preload was handled with a **Goodman correction**, and fatigue life was computed in the frequency domain with the **Dirlik method** (cross-checked against Steinberg's three-band approach):

$$
E[D] = \frac{T \, \nu_p}{C} \int_0^{\infty} S^m \, p_{Dirlik}(S) \, dS
$$

Model accuracy was scored against the solid reference using a combined ranking of fatigue life and RMS stress, evaluated per region (clamped members, under bolt head, at the nut) - weighed against solver cost.

**Results.**

* For **clamped members**, the 1D beam model gave the closest agreement with the solid reference across all load cases - at a fraction of the computational cost.
* **Bonded and CBUSH** models generally overpredicted stress and underpredicted fatigue life, in some cases by up to two orders of magnitude.
* In **local bolt regions**, simplified models were unreliable: the beam captured the correct stress magnitude for transverse loading but was non-conservative under axial loads. Bonded and CBUSH models cannot produce meaningful local bolt stresses at all.
* Dirlik and Steinberg life estimates agreed closely, confirming the model ranking was not an artifact of the fatigue method.

**Conclusions.** No single bolt model is universally best - the optimal choice depends on the desired response and dominant loading:

| Question to answer | Cheapest adequate model |
| :--- | :--- |
| Global response, load path, modal behaviour | Beam or bonded contact |
| Clamped member stress / fatigue life | Beam (or threadless solid) |
| Local bolt stress & fatigue (head fillet, nut) | 3D solid without threads |
| Thread-root stress from pretension | 3D solid with threads |
| Thread-related nonlinearities (e.g. self-loosening) | Threaded solid + nonlinear transient |

Phenomena that are too expensive to resolve in FE - sliding/self-loosening, bolt bending, hole elongation, embedding preload loss - can still be incorporated into design decisions through analytical governing conditions (e.g. $F_{Shear} < F_{friction}$, $\sigma_{bend} = M/W$). The resulting **decision flowchart**, **phenomenon-method matrix**, and benchmark results provide scoped engineering guidance for FE model selection under random-vibration fatigue.

**Keywords:** Bolted joints, Dirlik method, Finite element modeling, Modeling guidelines, Random vibration fatigue.
