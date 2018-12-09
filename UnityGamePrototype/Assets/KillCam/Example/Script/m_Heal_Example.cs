/// <summary>
/// m_Heal_Example
/// Script Writte by Briner Lovo
/// any question please contact to my email: brinerjhonson.lc@gmail.com
/// 
/// 
/// Use this script how exaple of how integrate with Damage Directional
/// </summary>

using UnityEngine;
using System.Collections;
using System.Collections.Generic;


public class m_Heal_Example : MonoBehaviour {

    public GameObject m_ragdoll;
	public AudioClip Hit_Sound;
    public Texture2D Splash_Screem;
    public Texture2D Button_Art;
    public float m_Healt = 100f;
    protected float m_alpha = 0.0f;
    public Color Splash_Color;
    protected bool show_Deat = false;
    public bool Show_Splash = true;
    private bool Alredy_Death = false;
    public int Respawn_Time;
    //Shake
    private static Vector3 originPosition;
    private static Quaternion originRotation;

    private static float shakeDecay = 0.005f;
    private static float shakeIntensity;

    /// <summary>
    /// Where recive information of damage and others
    /// </summary>
    /// <param name="DirectionAttack"> direction from atakker</param>
    /// <param name="from"> name of atakker</param>
public void Damage_Recive(float damage ,string from){

           m_Healt -= damage;
           m_alpha = 2.0f;
           if (m_Healt > 0.0f)
           {
               StartCoroutine(Shake(this.transform));
               AudioSource.PlayClipAtPoint(Hit_Sound, this.transform.position, 1.0f);

           }
           else if( m_Healt <= 0.0f)
           {
               m_Healt = 0.0f;
               if (!Alredy_Death)
               {
                  Death(from);
                   Alredy_Death = true;
               }
           }
	}

void OnGUI()
{
    GUI.Label(new Rect(25, (Screen.height - 50), 200, 35), m_Healt.ToString("000") + " % ",SimpleStyle);
    if (show_Deat)
        GUI.Label(new Rect(Screen.width / 2 - 125, Screen.height / 2, 350, 30), "You are death, wait for respawn..");

    if (m_alpha > 0.0f && Show_Splash)
    {
        m_alpha -= Time.deltaTime;
        GUI.color = new Color(Splash_Color.r, Splash_Color.g, Splash_Color.b, m_alpha);
        GUI.DrawTexture(new Rect(0, 0, Screen.width, Screen.height), Splash_Screem);
        GUI.color = Color.white;
    }

    if (m_Healt <= 0.0f)
    {
        Time.timeScale = Mathf.Lerp(1.0f, 0.1f, Time.deltaTime * 5);
    }
}

public static IEnumerator Shake(Transform t)
{
    originPosition = t.position;
    originRotation = t.rotation;
    shakeIntensity = 0.05f;
    while (shakeIntensity > 0)
    {
        t.position = originPosition + Random.insideUnitSphere * shakeIntensity;
        t.rotation = new Quaternion(
            originRotation.x + Random.Range(-shakeIntensity, shakeIntensity) * .2f,
            originRotation.y + Random.Range(-shakeIntensity, shakeIntensity) * .2f,
            originRotation.z + Random.Range(-shakeIntensity, shakeIntensity) * .2f,
            originRotation.w + Random.Range(-shakeIntensity, shakeIntensity) * .2f);
        shakeIntensity -= shakeDecay;
        yield return false;
    }
}

void Death(string Killer)
{
    GameObject DeatBody = Instantiate(m_ragdoll, Camera.main.transform.position, Camera.main.transform.rotation) as GameObject;
    bl_KillCam killcam = DeatBody.GetComponent<bl_KillCam>();
    killcam.Send_Target(Killer,Respawn_Time);
    Destroy(this.gameObject);
}


protected GUIStyle m_SimpleStyle = null;
public GUIStyle SimpleStyle
{
    get
    {
        if (m_SimpleStyle == null)
        {
            m_SimpleStyle = new GUIStyle("Label");
            m_SimpleStyle.alignment = TextAnchor.MiddleCenter;
            m_SimpleStyle.fontSize = 20;
            m_SimpleStyle.wordWrap = false;
            m_SimpleStyle.normal.textColor = Color.white;
            m_SimpleStyle.normal.background = Button_Art;
        }
        return m_SimpleStyle;
    }
}

public DI_Controller Controller
{
    get
    {
       return this.transform.root.GetComponent<DI_Controller>();
    }
}

public List<DI_MouseLook> m_Mouses
{
    
    get
    {
        List<DI_MouseLook> list = new List<DI_MouseLook>();
        list.Add(this.transform.GetComponent<DI_MouseLook>());

        list.Add(transform.root.GetComponentInChildren<DI_MouseLook>());

        return list;
    }
}
}
