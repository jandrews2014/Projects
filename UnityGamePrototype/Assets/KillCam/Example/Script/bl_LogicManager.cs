using UnityEngine;
using System.Collections;

public class bl_LogicManager : MonoBehaviour
{
    public GameObject m_player;
    public Transform[] WayPoins;

    void Update()
    {
        if (Input.GetKeyDown(KeyCode.R))
        {
            Application.LoadLevel("KillCam");
        }
    }

    void OnGUI()
    {
        GUI.Label(new Rect(Screen.width - 200, Screen.height - 172, 250, 35), "Press [R] to Respawn Now");
        
    }

    public void Respawn()
    {
        int t_random = Random.Range(0,WayPoins.Length);
        Instantiate(m_player, WayPoins[t_random].position, Quaternion.identity);
    }

}
