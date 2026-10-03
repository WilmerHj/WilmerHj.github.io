# More AI-automated meshing of a phone arm

The product is a part from an articulating arm to connect a phone like a desk lamp and it is getting topology optimized.

![CAD rendering of the redesigned phone-support arm with its mounting bracket and pentagonal connections.](images/PhoneArm/01_assembly_render.png)
*The arm in its assembly context: desk clamp, joint, and the optimized 300 mm link with pentagon holes at each end.*

## Summary
In the first post I topology-optimized one link of an articulating phone arm in Ansys Mechanical, redesigned it in Inventor, and checked the new design with FE analysis. I also asked ChatGPT-6 Codex Astra and Claude Opus 5.5 to build independent meshing workflows for the redesigned part. Both delivered a working all-hex mesh that imported into Ansys. The two meshes differ, but the results from them agree within 0.2 % in deflection and stiffness.

## Design brief
The arm supports a phone in a similar way to an articulated desk lamp. My requirements were to limit deflection to 1 mm under a 3 N load, reduce material use and develop a geometry suitable for 3D printing. The load represents a phone weighing approximately 270 g, rounded up for the design case. Pentagon-shaped pins lock the rotation at each end. The link is the part that gets topology optimized.

## How can this be extended?

In the first part I only asked AI to mesh one part. But some what about assemblies? Turns out that this works as well. This time I used PrePoMax instead of Ansys or Abaqus that I generally use. PrePoMax is basically a graphical interface for Calculix, which is an open-source FEA solver. I used the code-bases that was generated in the first part, and asked a new instance of codex to Codex to build use them as inspiration to build a meshing-tool for the new geometry.

The new tool identifies parts from a step-file containing the assembly and meshes each. In PrePoMax I was able to set nonlinear contacts to perform a nonlinear static analysis of the complete assembly. Since the beam/ link was already designed to have a deflection of 1 mm from 3N perpendicular, I already knew the order of magnitude of the deflection. I still used the 3N force, but also a 71g magsafe holder was added to the loaded hole and the supporting pin was no longer idealized, the surface of the deskholder that touches the desk as well as the top of the bolt was set as fixed. So I expected a deflection of more than 1 mm but not much more.

## The result of the full assembly

As expected, the larges magnitude of deflection was 1.45mm in negative Y-direction.

![CAD rendering of the redesigned phone-support arm with its mounting bracket and pentagonal connections.](images/PhoneArm_Continuation/Deflection_W_MagSafe.png)
*The Deflection of the fully AI-meshed assembly (desk clamp hidden).*

## A nice thing
I did something wrong in the design so the magsafe-holder and the beam/ link was inter... so I I realized this after the mesh was done (I noticed the error in PrePoMax) so I had to change the design. A quick fix in Inventor, only one dimension had to change but many other lines, bodies and faces changed dimesnion as well, but the topology itself remained identical. Still I had to remesh it.

Since the AI had generated a "Generate Mesh"-script, I simply exported the CAD to a step-file and ran the python code and in a second or two I had a new structured hex-mesh ready to be used. I did not have to change anything.

## A problem with PrePoMax
PrePoMax does not have topology optimiization built in, but Calculix has some tools to perform this and since the output is a INP file it is easy to build our own script. Ready-to-use scripts are available online, but since I'm currently looking into how AI can be used to assist, I asked ChatGPT in a new separete instance to write me a script that converts my nonlinear model to a linear surrogate and using Calculix/Beso, performes topology optimization on one of the parts in the assembly.

![CAD rendering of the redesigned phone-support arm with its mounting bracket and pentagonal connections.](images/PhoneArm_Continuation/Mass.png)
*The Deflection of the fully AI-meshed assembly (desk clamp hidden).*
![CAD rendering of the redesigned phone-support arm with its mounting bracket and pentagonal connections.](images/PhoneArm_Continuation/energy_density_mean.png)
*The Deflection of the fully AI-meshed assembly (desk clamp hidden).*

![CAD rendering of the redesigned phone-support arm with its mounting bracket and pentagonal connections.](images/PhoneArm_Continuation/Picture1.png)
*The Deflection of the fully AI-meshed assembly (desk clamp hidden).*

I had already done topology optimization on the beam/ link but not on the MagSafe-holder. I used 60% mass as Optimization Objective. It worked, but did not make any radical changes in design. I only implemented a hole in the backplate, not for mass reduction but for heat. I made sure that the hole I implemented was smaller than the one in from the optimization so it would not change the structural integrity too much.

![CAD rendering of the redesigned phone-support arm with its mounting bracket and pentagonal connections.](images/PhoneArm_Continuation/MagSafeFinal.png)
*The Deflection of the fully AI-meshed assembly (desk clamp hidden).*
![CAD rendering of the redesigned phone-support arm with its mounting bracket and pentagonal connections.](images/PhoneArm_Continuation/Picture1.png)
*The Deflection of the fully AI-meshed assembly (desk clamp hidden).*
