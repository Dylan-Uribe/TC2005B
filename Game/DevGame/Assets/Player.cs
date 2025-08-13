using UnityEngine;

//El nombre de la clase debe ser el mismo del de Unity
public class Player : MonoBehaviour
{
    //Inicializar variables
    Animator animator;


    // Start is called once before the first execution of Update after the MonoBehaviour is created
    void Start()
    {
        //(conectar todas las propiedades del animator)
        animator = GetComponent<Animator>();
    }

    // Update is called once per frame
    //Ejecutado cada cuadro por segundo (60)
    void Update()
    {
        if (Input.GetKey(KeyCode.K)) 
        {
            animator.Play("PlayerPunch");
        }
    }
}
