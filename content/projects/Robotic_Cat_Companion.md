**Overview.** *The Robotic Cat Companion* is a Standalone Consumer Robot (SCR) developed for children aged 3-8.

The cat is intentionally **not** a low-care pet substitute - it is a creative toy. Children **paint the wooden shell themselves**, swap **ears and hats**, and choose **personalities** through a companion website, so the same hardware can become endlessly different cats over time.

**Product goals (from the PRD).**
* **Innovative user experience** - a curious, story-enabled, ever-changeable robot friend that addresses unmet desires children haven't yet articulated.
* **Technology leadership** - modern consumer-robotics components and early prototype testing.
* **Competitive positioning** - feature/price parity with or above existing offerings (benchmarked against ImagiCharm and Pokémon-style toys).

**Target user.**
* **Buyer:** parents, grandparents, relatives or friends of children.
* **User:** children aged 3-8 with an interest in robotics or cats.
* **Scenario:** *"Elliot, an 8-year-old, is bored and uses ShellCat to stay satisfied with endless play and unlimited personalities. He paints and plays with the ShellCat and sees it as a real pet/friend."*

**Mechanical design.**
* **Outer shell:** **Masonite, laser-cut** - a wooden surface that takes paint well, fitting the brand's *Blanchedalmond* wooden look.
* **3D-printed plastic** parts for gears, the MCU case, the computer case, and battery holders.
* **Swappable accessories:** ears and hats designed to be made by the user from a manual included in the box.
* CAD modelled in **Inventor** to allow rapid iteration and a **modular design** for a future "world of characters."

**Electronics.**
The PRD splits the bill of materials between an early *prototype* and a cost-reduced *product* version:

| Subsystem | Prototype | Product |
| :--- | :--- | :--- |
| MCU | Arduino Uno | ATMEGA328P-PU |
| Computer | Raspberry Pi Zero WH | - (replaced by Wi-Fi + MCU) |
| Connectivity | (via Pi) | ESP8266 Wi-Fi module |
| Motion | 2$	imes$ DC motors + 1$	imes$ stepper (28BYJ-48 + ULN2003) | same |
| Sensing | Ultrasonic ranger | Ultrasonic ranger |
| Power | 3$	imes$ AA + 1$	imes$ 6LR holders | 3$	imes$ AA + 1$	imes$ 6LR holders |
| PCB | breadboard / wiring | Custom PCB |

**Functional requirements.**
* Natural, intuitive interaction with children.
* **Selectable personalities** - currently five, exposed via the companion website with regular updates planned.
* **Autonomous navigation** in a home environment with obstacle avoidance and the ability to approach objects within a defined area.
* **Safe interaction** with household objects, children, and pets.
* **Battery life** sufficient for at least one full day of typical use, with easy-to-change batteries.

**Non-functional requirements.**
* User-friendly setup with no maintenance.
* High durability and a low failure rate to support endless play.
* **Modular design** to allow future upgrades and new characters.

**Companion website.** A web app (a visual copy hosted at *here* and is also shown in one of the videos) lets the user pick the cat's personality and will host a community forum where suggestions can be voted on and rolled into future updates - closing a loop directly back into the product.

**Brand & story.** ShellCats are described in the PRD as having come from a worn-out world to Earth via a "magical spell," carrying protective shells that children can decorate to express each cat's personality.

**Process.** The development followed a **Design-Build-Test (DBT) and gate** workflow with early user-testing prototypes feeding back into the design before each gate.
