using Sandbox.Game.EntityComponents;
using Sandbox.ModAPI.Ingame;
using Sandbox.ModAPI.Interfaces;
using SpaceEngineers.Game.ModAPI.Ingame;
using System.Collections.Generic;
using System.Collections;
using System.Linq;
using System.Text;
using System;
using VRage.Collections;
using VRage.Game.Components;
using VRage.Game.GUI.TextPanel;
using VRage.Game.ModAPI.Ingame.Utilities;
using VRage.Game.ModAPI.Ingame;
using VRage.Game.ObjectBuilders.Definitions;
using VRage.Game;
using VRage;
using VRageMath;
using Sandbox.Common.ObjectBuilders;

namespace IngameScript
{
    partial class Program : MyGridProgram
    {
        // This file contains your actual script.
        //
        // You can either keep all your code here, or you can create separate
        // code files to make your program easier to navigate while coding.
        //
        // In order to add a new utility class, right-click on your project,
        // select 'New' then 'Add Item...'. Now find the 'Space Engineers'
        // category under 'Visual C# Items' on the left hand side, and select
        // 'Utility Class' in the main area. Name it in the box below, and
        // press OK. This utility class will be merged in with your code when
        // deploying your final script.
        //
        // You can also simply create a new utility class manually, you don't
        // have to use the template if you don't want to. Just do so the first
        // time to see what a utility class looks like.
        //
        // Go to:
        // https://github.com/malware-dev/MDK-SE/wiki/Quick-Introduction-to-Space-Engineers-Ingame-Scripts
        //
        // to learn more about ingame scripts.

        public Program()
        {
            Runtime.UpdateFrequency = UpdateFrequency.Update100;
        }

        public void Main(string argument, UpdateType updateSource)
        {
            Update();
        }
        public void Update()
        {
            List<IMyTextPanel> LCDpanels = new getBlocks(GridTerminalSystem).GetLCDs();
            foreach (IMyTextPanel panel in LCDpanels)
            {
                if (panel != null)
                {
                    panel.ContentType = ContentType.TEXT_AND_IMAGE;
                    panel.Alignment = VRage.Game.GUI.TextPanel.TextAlignment.CENTER;
                    panel.FontSize = 0.4f;
                    panel.Font = "Monospace";
                    panel.WriteText("");


                    string customData = panel.CustomData;
                    string[] functions = customData.Split(new string[] { "\n" }, StringSplitOptions.None);
                    foreach (string f in functions)
                    {
                        switch (f)
                        {
                            case "solar":
                                new renderOutput(GridTerminalSystem).solarRender(panel);
                                break;
                            case "energyGeneration":
                            case "energy_generation":
                                new renderOutput(GridTerminalSystem).energyGenerationRender(panel);
                                break;
                        }
                        endline(panel);
                    }

                }
            }
           return;
        }
        void endline(IMyTextPanel panel)
        {
            panel.WriteText("\n", true);
            return;
        }
        public class renderOutput {

            private IMyGridTerminalSystem GridTerminalSystem;
            public renderOutput(IMyGridTerminalSystem GTS) {
                GridTerminalSystem = GTS;
            }
            public void solarRender(IMyTextPanel panel)
            {
                panel.WriteText("<< Solaranlagen >>", true);
                endline(panel);
                panel.WriteText("-----------", true);
                endline(panel);

                List<IMySolarPanel> panels = new getBlocks(GridTerminalSystem).GetSpanels();
                foreach (IMySolarPanel p in panels)
                {
                    float v = p.CurrentOutput * 1000f;
                    float cO = v;
                    float mO = 160;
                    float percent = 0;
                    if (mO > 0)
                    {
                        percent = (cO / mO) * 100;
                    }
                    else
                    {
                        percent = 0;
                    }
                    panel.WriteText(p.DisplayNameText + "    " + Math.Round(cO * 100f) / 100f + "kW" + " von " + mO + "kW" + "\n" + percentShow(percent, 25).ToString(), true);
                    endline(panel);
                }
                return;
            }
#pragma warning disable ProhibitedMemberRule // Prohibited Type Or Member
            public void energyGenerationRender(IMyTextPanel panel)
#pragma warning restore ProhibitedMemberRule // Prohibited Type Or Member
            {
                panel.WriteText("<< Stromgeneration >>", true);
                endline(panel);
                panel.WriteText("-----------", true);
                endline(panel);
                panel.WriteText("< Solaranlagen >\n", true);

                List<IMySolarPanel> panels = new getBlocks(GridTerminalSystem).GetSpanels();
                float fullCO = 0;
                float fullMO = panels.Count() * 160;
                foreach (IMySolarPanel p in panels)
                {
                    float cO = p.CurrentOutput * 1000f;
                    fullCO = fullCO + cO;
                }

                float percent = 0;
                if (fullMO > 0)
                {
                    percent = (fullCO / fullMO) * 100;
                }
                else
                {
                    percent = 0;
                }
                panel.WriteText(Math.Round(fullCO * 100f) / 100f + "kW" + " von " + fullMO + "kW" + "\n" + percentShow(percent, 25).ToString(), true);
                endline(panel);
                endline(panel);
                panel.WriteText("< Reaktoren >\n", true);

                List<IMyReactor> Rpanels = new getBlocks(GridTerminalSystem).GetReactors();
                //float RfullCO = 0;
                float RfullMO = 0;
                float RfullCO = 0;
                foreach (IMyReactor r in Rpanels)
                {
                    double radius = r.WorldVolume.Radius;
                    float cO = r.CurrentOutput * 1000f;
                    RfullCO = RfullCO + cO;
                    if (radius > 6)
                    {
                        RfullMO = RfullMO + 300000f;
                    }
                    else
                    {
                        RfullMO = RfullMO + 15000f;
                    }
                }
                float Rpercent = 0;
                if (RfullMO > 0)
                {
                    Rpercent = (RfullCO / RfullMO) * 100;
                }
                else
                {
                    Rpercent = 0;
                }
                panel.WriteText(Math.Round(RfullCO * 100f) / 100f + "kW" + " von " + RfullMO + "kW" + "\n" + percentShow(Rpercent, 25).ToString(), true);
                endline(panel);
                return;
            }
            public void endline(IMyTextPanel panel)
            {
                panel.WriteText("\n", true);
                return;
            }

            public string percentShow(float pC, int div = 10)
            {
                string r = "";
                for (int i = 0; i < (pC / (100 / div)); i++)
                {
                    r = r + "\u2588".ToString();
                }
                for (int i = 0; i < (div - (pC / (100 / div))); i++)
                {
                    r = r + "\u2581".ToString();
                }
                return "[" + r + "]".ToString();
            }
        }
        public class getBlocks
        {
            private IMyGridTerminalSystem GridTerminalSystem;
            private List<IMyTextPanel> TPanels;
            private List<IMySolarPanel> SPanels;
            private List<IMyReactor> Reactors;
            private List<IMyTerminalBlock> allBlocks;
            
            public getBlocks(IMyGridTerminalSystem GTS)
            {
                GridTerminalSystem = GTS;
                TPanels = new List<IMyTextPanel>();
                SPanels = new List<IMySolarPanel>();
                Reactors = new List<IMyReactor>();
                allBlocks = new List<IMyTerminalBlock>();
                GridTerminalSystem.GetBlocks(allBlocks);
                for (int i = 0; i < allBlocks.Count; i++)
                {
                    if (allBlocks[i] is IMyTextPanel)
                    {
                        TPanels.Add((IMyTextPanel)allBlocks[i]);
                    }
                    else if (allBlocks[i] is IMySolarPanel)
                    {
                        SPanels.Add((IMySolarPanel)allBlocks[i]);
                    }
                    else if (allBlocks[i] is IMyReactor)
                    {
                        Reactors.Add((IMyReactor)allBlocks[i]);
                    }
                }
            }
            public List<IMyTextPanel> GetLCDs()
            {
                return TPanels;
            }
            public List<IMySolarPanel> GetSpanels()
            {
                return SPanels;
            }
            public List<IMyReactor> GetReactors()
            {
                return Reactors;
            }
        }
    }
}
