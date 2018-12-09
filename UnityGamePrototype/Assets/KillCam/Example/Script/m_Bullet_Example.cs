/// <summary>
/// m_Bullet_Example
/// Script Writte by Briner Lovo
/// any question please contact to my email: brinerjhonson.lc@gmail.com
/// </summary>

using UnityEngine;
using System.Collections;

public class m_Bullet_Example : MonoBehaviour {

	public Transform m_Owner_Position;
	public float m_Time_To_Destroy = 3;
	private bool is_Use = false;
	public string m_Player_Tag = "Player";
    private string m_name;
    public float damping = 1.0f;
    public float  drivespeed = 15;

	void Start(){

		Destroy (gameObject, m_Time_To_Destroy);
        m_name = m_Owner_Position.name;

	}

     

	void OnCollisionEnter(Collision col){
		if (!is_Use) {
			if(col.transform.tag == m_Player_Tag){
				m_Heal_Example Healt = col.transform.GetComponent<m_Heal_Example>();
				Healt.Damage_Recive(10f,m_name);
				is_Use = true;
			}
			}
		}

	/*void OnTriggerEnter(Collider col)
	{
		if (!is_Use) {
			if(col.transform.tag == m_Player_Tag){
				m_Heal_Example Healt = col.transform.GetComponent<m_Heal_Example>();
				Healt.Damage_Recive(m_Owner_Position.position);
				is_Use = true;
			}
		}
	}*/
}
